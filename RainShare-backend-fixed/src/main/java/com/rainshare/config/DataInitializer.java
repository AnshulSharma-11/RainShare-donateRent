package com.rainshare.config;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rainshare.entities.Category;
import com.rainshare.entities.Donation;
import com.rainshare.entities.RainGear;
import com.rainshare.entities.Rental;
import com.rainshare.entities.User;
import com.rainshare.enums.DonationStatus;
import com.rainshare.enums.GearCondition;
import com.rainshare.enums.GearStatus;
import com.rainshare.enums.RentalStatus;
import com.rainshare.enums.Role;
import com.rainshare.repositories.CategoryRepository;
import com.rainshare.repositories.DonationRepository;
import com.rainshare.repositories.RainGearRepository;
import com.rainshare.repositories.RentalRepository;
import com.rainshare.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository users;
    private final CategoryRepository categories;
    private final RainGearRepository gears;
    private final DonationRepository donations;
    private final RentalRepository rentals;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }

        User admin = saveUser("Admin User", "admin@rain.com", "admin123", "9000000001", "Mumbai HQ", Role.ADMIN);
        User donor1 = saveUser("Priya Sharma", "donor1@rain.com", "donor123", "9000000002", "Andheri, Mumbai", Role.DONOR);
        User donor2 = saveUser("Rahul Verma", "donor2@rain.com", "donor123", "9000000003", "Bandra, Mumbai", Role.DONOR);
        User donor3 = saveUser("Sneha Patil", "donor3@rain.com", "donor123", "9000000004", "Dadar, Mumbai", Role.DONOR);
        User renter1 = saveUser("Kavya Nair", "renter1@rain.com", "renter123", "9000000006", "Pune", Role.RENTER);
        User renter2 = saveUser("Dev Joshi", "renter2@rain.com", "renter123", "9000000007", "Thane", Role.RENTER);

        Category umbrella = saveCategory("Umbrella", "All types of umbrellas");
        Category raincoat = saveCategory("Raincoat", "Waterproof coats and jackets");
        Category boots = saveCategory("Rain Boots", "Rubber and waterproof boots");
        Category poncho = saveCategory("Poncho", "Lightweight rain ponchos");
        Category pants = saveCategory("Rain Pants", "Waterproof trousers");

        RainGear gear1 = saveGear("Heavy-duty Golf Umbrella", "Large windproof golf umbrella.", umbrella, donor1,
                GearCondition.GOOD, 30.0, GearStatus.AVAILABLE,
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop");
        RainGear gear2 = saveGear("Compact Travel Umbrella", "Foldable auto-open umbrella.", umbrella, donor1,
                GearCondition.NEW, 0.0, GearStatus.AVAILABLE,
                "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=400&h=300&fit=crop");
        RainGear gear3 = saveGear("Adult Waterproof Raincoat", "Size L, fully seam-sealed.", raincoat, donor2,
                GearCondition.GOOD, 50.0, GearStatus.AVAILABLE,
                "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=300&fit=crop");
        RainGear gear4 = saveGear("Rubber Rain Boots Size 42", "Classic Wellington boots.", boots, donor3,
                GearCondition.GOOD, 40.0, GearStatus.RENTED,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop");
        RainGear gear5 = saveGear("Reusable Heavy Poncho Green", "Durable PVC poncho with hood.", poncho, donor2,
                GearCondition.GOOD, 25.0, GearStatus.AVAILABLE,
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop");
        saveGear("Waterproof Hiking Pants", "Lightweight trail rain pants.", pants, donor1,
                GearCondition.GOOD, 35.0, GearStatus.AVAILABLE,
                "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop");

        saveDonation(gear2, donor1, DonationStatus.CONFIRMED);
        saveDonation(gear5, donor2, DonationStatus.PENDING);

        saveRental(gear1, renter2, LocalDate.of(2024, 3, 10), LocalDate.of(2024, 3, 17), RentalStatus.ACTIVE);
        saveRental(gear3, renter1, LocalDate.of(2024, 3, 15), LocalDate.of(2024, 3, 22), RentalStatus.ACTIVE);
        saveRental(gear4, renter1, LocalDate.of(2024, 3, 1), LocalDate.of(2024, 3, 7), RentalStatus.RETURNED);
        saveRental(gear5, renter2, LocalDate.of(2024, 3, 12), LocalDate.of(2024, 3, 19), RentalStatus.PENDING);
    }

    private User saveUser(String name, String email, String password, String phone, String address, Role role) {
        return users.save(User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phone(phone)
                .address(address)
                .role(role)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build());
    }

    private Category saveCategory(String name, String description) {
        return categories.save(Category.builder().name(name).description(description).build());
    }

    private RainGear saveGear(String title, String description, Category category, User owner,
                              GearCondition condition, Double rentPrice, GearStatus status, String imageUrl) {
        return gears.save(RainGear.builder()
                .title(title)
                .description(description)
                .category(category)
                .owner(owner)
                .condition(condition)
                .rentPrice(rentPrice)
                .status(status)
                .imageUrl(imageUrl)
                .createdAt(LocalDateTime.now())
                .build());
    }

    private void saveDonation(RainGear gear, User donor, DonationStatus status) {
        donations.save(Donation.builder()
                .rainGear(gear)
                .donor(donor)
                .donationDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .status(status)
                .build());
    }

    private void saveRental(RainGear gear, User renter, LocalDate rentDate, LocalDate returnDate, RentalStatus status) {
        rentals.save(Rental.builder()
                .rainGear(gear)
                .renter(renter)
                .rentDate(rentDate)
                .returnDate(returnDate)
                .createdAt(LocalDateTime.now())
                .status(status)
                .build());
    }
}
