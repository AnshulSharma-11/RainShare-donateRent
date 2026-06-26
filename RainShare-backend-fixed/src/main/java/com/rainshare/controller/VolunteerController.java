package com.rainshare.controller;

import com.rainshare.entities.User;
import com.rainshare.entities.Volunteer;
import com.rainshare.repositories.UserRepository;
import com.rainshare.repositories.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VolunteerController {

    private final VolunteerRepository volunteers;
    private final UserRepository users;

    @PostMapping
    public Map<String, Object> save(@RequestBody Map<String, Object> data) {
        Volunteer volunteer = new Volunteer();
        apply(volunteer, data);
        return ApiCompat.volunteer(volunteers.save(volunteer));
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return volunteers.findAll().stream().map(ApiCompat::volunteer).toList();
    }

    @PatchMapping("/{id}")
    public Map<String, Object> patch(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Volunteer volunteer = volunteers.findById(id).orElseThrow();
        apply(volunteer, data);
        return ApiCompat.volunteer(volunteers.save(volunteer));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        volunteers.deleteById(id);
    }

    private void apply(Volunteer volunteer, Map<String, Object> data) {
        if (data.containsKey("city")) volunteer.setCity(ApiCompat.text(data, "city"));
        if (data.containsKey("availability")) volunteer.setAvailability(ApiCompat.availability(data.get("availability")));
        if (data.containsKey("motivation")) volunteer.setMotivation(ApiCompat.text(data, "motivation"));
        if (data.containsKey("status")) volunteer.setStatus(ApiCompat.text(data, "status"));
        if (data.containsKey("user_id")) {
            Long id = ApiCompat.number(data, "user_id");
            User user = id == null ? null : users.findById(id).orElse(null);
            volunteer.setUser(user);
        }
    }
}
