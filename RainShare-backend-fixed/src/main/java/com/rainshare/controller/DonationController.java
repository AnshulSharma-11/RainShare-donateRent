package com.rainshare.controller;

import com.rainshare.entities.Donation;
import com.rainshare.entities.RainGear;
import com.rainshare.entities.User;
import com.rainshare.repositories.DonationRepository;
import com.rainshare.repositories.RainGearRepository;
import com.rainshare.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DonationController {

    private final DonationRepository donations;
    private final RainGearRepository gears;
    private final UserRepository users;

    @PostMapping
    public Map<String, Object> save(@RequestBody Map<String, Object> data) {
        Donation donation = new Donation();
        apply(donation, data);
        if (donation.getDonationDate() == null) donation.setDonationDate(LocalDate.now());
        if (donation.getCreatedAt() == null) donation.setCreatedAt(LocalDateTime.now());
        return ApiCompat.donation(donations.save(donation), false);
    }

    @GetMapping
    public List<Map<String, Object>> getAll(@RequestParam Map<String, String> params) {
        boolean expandGear = "gear".equalsIgnoreCase(params.get("_expand"));
        return donations.findAll().stream()
                .filter(donation -> ApiCompat.matches(donation.getDonor() == null ? null : donation.getDonor().getId(), params.get("donor_id")))
                .filter(donation -> ApiCompat.matches(donation.getStatus() == null ? null : donation.getStatus().name(), params.get("status")))
                .map(donation -> ApiCompat.donation(donation, expandGear))
                .toList();
    }

    @PatchMapping("/{id}")
    public Map<String, Object> patch(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Donation donation = donations.findById(id).orElseThrow();
        apply(donation, data);
        return ApiCompat.donation(donations.save(donation), false);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        donations.deleteById(id);
    }

    private void apply(Donation donation, Map<String, Object> data) {
        if (data.containsKey("donation_date")) donation.setDonationDate(ApiCompat.localDate(data, "donation_date"));
        if (data.containsKey("status")) donation.setStatus(ApiCompat.donationStatus(ApiCompat.text(data, "status")));
        if (data.containsKey("created_at")) donation.setCreatedAt(ApiCompat.localDateTime(data, "created_at"));
        if (data.containsKey("gear_id")) {
            Long id = ApiCompat.number(data, "gear_id");
            RainGear gear = id == null ? null : gears.findById(id).orElse(null);
            donation.setRainGear(gear);
        }
        if (data.containsKey("donor_id")) {
            Long id = ApiCompat.number(data, "donor_id");
            User donor = id == null ? null : users.findById(id).orElse(null);
            donation.setDonor(donor);
        }
    }
}
