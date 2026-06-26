package com.rainshare.controller;

import com.rainshare.entities.Category;
import com.rainshare.entities.RainGear;
import com.rainshare.entities.User;
import com.rainshare.repositories.CategoryRepository;
import com.rainshare.repositories.RainGearRepository;
import com.rainshare.repositories.UserRepository;
import com.rainshare.service.RainGearService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/rain_gear", "/api/gears"})
@RequiredArgsConstructor
@CrossOrigin("*")
public class RainGearController {

    private final RainGearService service;
    private final RainGearRepository gears;
    private final CategoryRepository categories;
    private final UserRepository users;

    @PostMapping
    public Map<String, Object> save(@RequestBody Map<String, Object> data){
        RainGear gear = new RainGear();
        apply(gear, data);
        if (gear.getCreatedAt() == null) gear.setCreatedAt(LocalDateTime.now());
        return ApiCompat.gear(gears.save(gear));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(@RequestParam Map<String, String> params){
        List<Map<String, Object>> all = gears.findAll().stream()
                .filter(gear -> ApiCompat.matches(gear.getOwner() == null ? null : gear.getOwner().getId(), params.get("owner_id")))
                .filter(gear -> ApiCompat.matches(gear.getCategory() == null ? null : gear.getCategory().getId(), params.get("category_id")))
                .filter(gear -> ApiCompat.matches(gear.getCondition() == null ? null : gear.getCondition().name(), params.get("condition")))
                .filter(gear -> ApiCompat.matches(gear.getStatus() == null ? null : gear.getStatus().name(), params.get("status")))
                .filter(gear -> ApiCompat.matches(gear.getRentPrice(), params.get("rent_price")))
                .filter(gear -> {
                    String q = params.get("q");
                    if (q == null || q.isBlank()) return true;
                    String haystack = (gear.getTitle() + " " + gear.getDescription()).toLowerCase();
                    return haystack.contains(q.toLowerCase());
                })
                .map(ApiCompat::gear)
                .toList();
        int total = all.size();
        List<Map<String, Object>> page = page(all, params);
        return ResponseEntity.ok().header("X-Total-Count", String.valueOf(total)).body(page);
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id){
        return ApiCompat.gear(service.getById(id));
    }

    @PatchMapping("/{id}")
    public Map<String, Object> patch(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        RainGear gear = gears.findById(id).orElseThrow();
        apply(gear, data);
        return ApiCompat.gear(gears.save(gear));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    private void apply(RainGear gear, Map<String, Object> data) {
        if (data.containsKey("title")) gear.setTitle(ApiCompat.text(data, "title"));
        if (data.containsKey("description")) gear.setDescription(ApiCompat.text(data, "description"));
        if (data.containsKey("image_url")) gear.setImageUrl(ApiCompat.text(data, "image_url"));
        if (data.containsKey("imageUrl")) gear.setImageUrl(ApiCompat.text(data, "imageUrl"));
        if (data.containsKey("condition")) gear.setCondition(ApiCompat.condition(ApiCompat.text(data, "condition")));
        if (data.containsKey("rent_price")) gear.setRentPrice(ApiCompat.decimal(data, "rent_price"));
        if (data.containsKey("rentPrice")) gear.setRentPrice(ApiCompat.decimal(data, "rentPrice"));
        if (data.containsKey("status")) gear.setStatus(ApiCompat.gearStatus(ApiCompat.text(data, "status")));
        if (data.containsKey("category_id")) {
            Long id = ApiCompat.number(data, "category_id");
            Category category = id == null ? null : categories.findById(id).orElse(null);
            gear.setCategory(category);
        }
        if (data.containsKey("owner_id")) {
            Long id = ApiCompat.number(data, "owner_id");
            User owner = id == null ? null : users.findById(id).orElse(null);
            gear.setOwner(owner);
        }
        if (data.containsKey("created_at")) gear.setCreatedAt(ApiCompat.localDateTime(data, "created_at"));
    }

    private List<Map<String, Object>> page(List<Map<String, Object>> items, Map<String, String> params) {
        int limit = parse(params.get("_limit"), items.size());
        int page = parse(params.get("_page"), 1);
        int from = Math.max(0, Math.min(items.size(), (page - 1) * limit));
        int to = Math.max(from, Math.min(items.size(), from + limit));
        return items.subList(from, to);
    }

    private int parse(String value, int fallback) {
        if (value == null || value.isBlank()) return fallback;
        return Integer.parseInt(value);
    }
}
