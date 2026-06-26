package com.rainshare.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activityLog")
@CrossOrigin("*")
public class ActivityLogController {

    @GetMapping
    public List<Map<String, Object>> list() {
        return List.of();
    }
}
