package com.rainshare.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.rainshare.entities.Category;
import com.rainshare.entities.Donation;
import com.rainshare.entities.RainGear;
import com.rainshare.entities.Rental;
import com.rainshare.entities.User;
import com.rainshare.entities.Volunteer;
import com.rainshare.enums.DonationStatus;
import com.rainshare.enums.GearCondition;
import com.rainshare.enums.GearStatus;
import com.rainshare.enums.RentalStatus;
import com.rainshare.enums.Role;

public final class ApiCompat {

    private ApiCompat() {
    }

    public static Map<String, Object> user(User user) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", user.getId());
        out.put("full_name", user.getFullName());
        out.put("name", user.getFullName());
        out.put("email", user.getEmail());
        out.put("phone", user.getPhone());
        out.put("address", user.getAddress());
        out.put("role", lower(user.getRole()));
        out.put("active", user.getActive() == null || user.getActive());
        out.put("created_at", dateTime(user.getCreatedAt()));
        out.put("createdAt", dateTime(user.getCreatedAt()));
        return out;
    }

    static Map<String, Object> gear(RainGear gear) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", gear.getId());
        out.put("title", gear.getTitle());
        out.put("description", gear.getDescription());
        out.put("category_id", gear.getCategory() == null ? null : gear.getCategory().getId());
        out.put("category", gear.getCategory() == null ? null : gear.getCategory().getName());
        out.put("owner_id", gear.getOwner() == null ? null : gear.getOwner().getId());
        out.put("condition", lower(gear.getCondition()));
        out.put("rent_price", gear.getRentPrice());
        out.put("image_url", gear.getImageUrl());
        out.put("status", lower(gear.getStatus()));
        out.put("available", gear.getStatus() == null || gear.getStatus() == GearStatus.AVAILABLE);
        out.put("created_at", dateTime(gear.getCreatedAt()));
        out.put("createdAt", dateTime(gear.getCreatedAt()));
        return out;
    }

    static Map<String, Object> rental(Rental rental, boolean expandGear) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", rental.getId());
        out.put("gear_id", rental.getRainGear() == null ? null : rental.getRainGear().getId());
        out.put("renter_id", rental.getRenter() == null ? null : rental.getRenter().getId());
        out.put("renter_name", rental.getRenter() == null ? null : rental.getRenter().getFullName());
        out.put("rent_date", date(rental.getRentDate()));
        out.put("return_date", date(rental.getReturnDate()));
        out.put("status", lower(rental.getStatus()));
        out.put("created_at", dateTime(rental.getCreatedAt()));
        out.put("approved_at", dateTime(rental.getApprovedAt()));
        out.put("declined_at", dateTime(rental.getDeclinedAt()));
        out.put("returned_at", dateTime(rental.getReturnedAt()));
        out.put("cancelled_at", dateTime(rental.getCancelledAt()));
        out.put("flagged_at", dateTime(rental.getFlaggedAt()));
        if (expandGear && rental.getRainGear() != null) {
            out.put("gear", gear(rental.getRainGear()));
        }
        return out;
    }

    static Map<String, Object> donation(Donation donation, boolean expandGear) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", donation.getId());
        out.put("gear_id", donation.getRainGear() == null ? null : donation.getRainGear().getId());
        out.put("donor_id", donation.getDonor() == null ? null : donation.getDonor().getId());
        out.put("donation_date", date(donation.getDonationDate()));
        out.put("status", lower(donation.getStatus()));
        out.put("created_at", dateTime(donation.getCreatedAt()));
        if (expandGear && donation.getRainGear() != null) {
            out.put("gear", gear(donation.getRainGear()));
        }
        return out;
    }

    static Map<String, Object> volunteer(Volunteer volunteer) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", volunteer.getId());
        out.put("user_id", volunteer.getUser() == null ? null : volunteer.getUser().getId());
        out.put("city", volunteer.getCity());
        out.put("availability", split(volunteer.getAvailability()));
        out.put("motivation", volunteer.getMotivation());
        out.put("status", volunteer.getStatus());
        return out;
    }

    static String text(Map<String, Object> data, String key) {
        Object value = data.get(key);
        return value == null ? null : String.valueOf(value);
    }

    static Long number(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null || String.valueOf(value).isBlank()) return null;
        if (value instanceof Number number) return number.longValue();
        return Long.valueOf(String.valueOf(value));
    }

    static Double decimal(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null || String.valueOf(value).isBlank()) return null;
        if (value instanceof Number number) return number.doubleValue();
        return Double.valueOf(String.valueOf(value));
    }

    static Boolean bool(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null) return null;
        if (value instanceof Boolean bool) return bool;
        return Boolean.valueOf(String.valueOf(value));
    }

    static LocalDate localDate(Map<String, Object> data, String key) {
        String value = text(data, key);
        if (value == null || value.isBlank()) return null;
        return LocalDate.parse(value.substring(0, Math.min(10, value.length())));
    }

    static LocalDateTime localDateTime(Map<String, Object> data, String key) {
        String value = text(data, key);
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDateTime.parse(value.replace("Z", ""));
        } catch (DateTimeParseException ex) {
            return LocalDateTime.now();
        }
    }

    static Role role(String value) {
        return enumValue(Role.class, value, Role.RENTER);
    }

    static GearCondition condition(String value) {
        return enumValue(GearCondition.class, value, GearCondition.GOOD);
    }

    static GearStatus gearStatus(String value) {
        return enumValue(GearStatus.class, value, GearStatus.AVAILABLE);
    }

    static RentalStatus rentalStatus(String value) {
        return enumValue(RentalStatus.class, value, RentalStatus.PENDING);
    }

    static DonationStatus donationStatus(String value) {
        return enumValue(DonationStatus.class, value, DonationStatus.PENDING);
    }

    static String availability(Object value) {
        if (value == null) return null;
        if (value instanceof List<?> list) {
            return String.join(",", list.stream().map(String::valueOf).toList());
        }
        return String.valueOf(value);
    }

    static boolean matches(Object actual, String expected) {
        if (expected == null || expected.isBlank()) return true;
        return actual != null && String.valueOf(actual).equalsIgnoreCase(expected);
    }

    private static <E extends Enum<E>> E enumValue(Class<E> type, String value, E fallback) {
        if (value == null || value.isBlank()) return fallback;
        return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT));
    }

    public static String lower(Enum<?> value) {
        return value == null ? null : value.name().toLowerCase(Locale.ROOT);
    }

    private static String date(LocalDate value) {
        return value == null ? null : value.toString();
    }

    private static String dateTime(LocalDateTime value) {
        return value == null ? null : value.toString();
    }

    private static List<String> split(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(",")).map(String::trim).filter(s -> !s.isBlank()).toList();
    }
}
