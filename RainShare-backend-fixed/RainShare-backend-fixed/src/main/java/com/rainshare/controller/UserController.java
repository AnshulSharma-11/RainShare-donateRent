package com.rainshare.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.rainshare.entities.User;
import com.rainshare.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam Map<String, String> params) {
        return users.findAll().stream()
                .filter(user -> ApiCompat.matches(user.getEmail(), params.get("email")))
                .filter(user -> ApiCompat.matches(user.getRole() == null ? null : user.getRole().name(), params.get("role")))
                .map(ApiCompat::user)
                .toList();
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        return ApiCompat.user(users.findById(id).orElseThrow());
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> data) {
        User user = new User();
        apply(user, data);
        if (user.getActive() == null) user.setActive(true);
        if (user.getCreatedAt() == null) user.setCreatedAt(LocalDateTime.now());
        return ApiCompat.user(users.save(user));
    }

    @PatchMapping("/{id}")
    public Map<String, Object> patch(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        User user = users.findById(id).orElseThrow();
        apply(user, data);
        return ApiCompat.user(users.save(user));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        users.deleteById(id);
    }

    private void apply(User user, Map<String, Object> data) {
        if (data.containsKey("full_name")) user.setFullName(ApiCompat.text(data, "full_name"));
        if (data.containsKey("fullName")) user.setFullName(ApiCompat.text(data, "fullName"));
        if (data.containsKey("name")) user.setFullName(ApiCompat.text(data, "name"));
        if (data.containsKey("email")) user.setEmail(ApiCompat.text(data, "email"));
        if (data.containsKey("password")) {
            String raw = ApiCompat.text(data, "password");
            user.setPassword(encodeIfNeeded(raw));
        }
        if (data.containsKey("phone")) user.setPhone(ApiCompat.text(data, "phone"));
        if (data.containsKey("address")) user.setAddress(ApiCompat.text(data, "address"));
        if (data.containsKey("role")) user.setRole(ApiCompat.role(ApiCompat.text(data, "role")));
        if (data.containsKey("active")) user.setActive(ApiCompat.bool(data, "active"));
        if (data.containsKey("created_at")) user.setCreatedAt(ApiCompat.localDateTime(data, "created_at"));
        if (data.containsKey("createdAt")) user.setCreatedAt(ApiCompat.localDateTime(data, "createdAt"));
    }

    private String encodeIfNeeded(String raw) {
        if (raw == null || raw.isBlank()) return raw;
        if (raw.startsWith("$2a$") || raw.startsWith("$2b$")) return raw;
        return passwordEncoder.encode(raw);
    }
}
