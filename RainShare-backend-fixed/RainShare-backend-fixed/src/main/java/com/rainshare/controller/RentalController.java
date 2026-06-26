package com.rainshare.controller;

import com.rainshare.entities.RainGear;
import com.rainshare.entities.Rental;
import com.rainshare.entities.User;
import com.rainshare.repositories.RainGearRepository;
import com.rainshare.repositories.RentalRepository;
import com.rainshare.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RentalController {

    private final RentalRepository rentals;
    private final RainGearRepository gears;
    private final UserRepository users;

    @PostMapping
    public Map<String, Object> save(@RequestBody Map<String, Object> data) {
        Rental rental = new Rental();
        apply(rental, data);
        if (rental.getCreatedAt() == null) rental.setCreatedAt(LocalDateTime.now());
        return ApiCompat.rental(rentals.save(rental), false);
    }

    @GetMapping
    public List<Map<String, Object>> getAll(
            @RequestParam Map<String, String> params,
            @RequestParam(required = false) List<String> gear_id) {
        boolean expandGear = "gear".equalsIgnoreCase(params.get("_expand"));
        return rentals.findAll().stream()
                .filter(rental -> ApiCompat.matches(rental.getRenter() == null ? null : rental.getRenter().getId(), params.get("renter_id")))
                .filter(rental -> matchesGear(rental, gear_id, params.get("gear_id")))
                .filter(rental -> ApiCompat.matches(rental.getStatus() == null ? null : rental.getStatus().name(), params.get("status")))
                .map(rental -> ApiCompat.rental(rental, expandGear))
                .toList();
    }

    @PatchMapping("/{id}")
    public Map<String, Object> patch(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Rental rental = rentals.findById(id).orElseThrow();
        apply(rental, data);
        return ApiCompat.rental(rentals.save(rental), false);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        rentals.deleteById(id);
    }

    private boolean matchesGear(Rental rental, List<String> gearIds, String singleGearId) {
        if ((gearIds == null || gearIds.isEmpty()) && (singleGearId == null || singleGearId.isBlank())) {
            return true;
        }
        Long actual = rental.getRainGear() == null ? null : rental.getRainGear().getId();
        if (actual == null) return false;
        if (gearIds != null && !gearIds.isEmpty()) {
            return gearIds.stream().anyMatch(id -> ApiCompat.matches(actual, id));
        }
        return List.of(singleGearId.split(",")).stream().anyMatch(id -> ApiCompat.matches(actual, id));
    }

    private void apply(Rental rental, Map<String, Object> data) {
        if (data.containsKey("rent_date")) rental.setRentDate(ApiCompat.localDate(data, "rent_date"));
        if (data.containsKey("return_date")) rental.setReturnDate(ApiCompat.localDate(data, "return_date"));
        if (data.containsKey("status")) rental.setStatus(ApiCompat.rentalStatus(ApiCompat.text(data, "status")));
        if (data.containsKey("created_at")) rental.setCreatedAt(ApiCompat.localDateTime(data, "created_at"));
        if (data.containsKey("approved_at")) rental.setApprovedAt(ApiCompat.localDateTime(data, "approved_at"));
        if (data.containsKey("declined_at")) rental.setDeclinedAt(ApiCompat.localDateTime(data, "declined_at"));
        if (data.containsKey("returned_at")) rental.setReturnedAt(ApiCompat.localDateTime(data, "returned_at"));
        if (data.containsKey("cancelled_at")) rental.setCancelledAt(ApiCompat.localDateTime(data, "cancelled_at"));
        if (data.containsKey("flagged_at")) rental.setFlaggedAt(ApiCompat.localDateTime(data, "flagged_at"));
        if (data.containsKey("gear_id")) {
            Long id = ApiCompat.number(data, "gear_id");
            RainGear gear = id == null ? null : gears.findById(id).orElse(null);
            rental.setRainGear(gear);
        }
        if (data.containsKey("renter_id")) {
            Long id = ApiCompat.number(data, "renter_id");
            User renter = id == null ? null : users.findById(id).orElse(null);
            rental.setRenter(renter);
        }
    }
}
