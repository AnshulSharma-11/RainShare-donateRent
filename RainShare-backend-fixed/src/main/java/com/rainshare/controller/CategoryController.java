package com.rainshare.controller;

import com.rainshare.entities.Category;
import com.rainshare.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategoryController {

    private final CategoryRepository categories;

    @PostMapping
    public Category save(@RequestBody Category category) {
        return categories.save(category);
    }

    @GetMapping
    public List<Category> getAll() {
        return categories.findAll();
    }

    @PatchMapping("/{id}")
    public Category patch(@PathVariable Long id, @RequestBody Category data) {
        Category category = categories.findById(id).orElseThrow();
        if (data.getName() != null) category.setName(data.getName());
        if (data.getDescription() != null) category.setDescription(data.getDescription());
        return categories.save(category);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categories.deleteById(id);
    }
}
