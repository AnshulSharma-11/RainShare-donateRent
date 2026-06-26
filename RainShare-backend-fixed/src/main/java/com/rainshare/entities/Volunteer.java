package com.rainshare.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "volunteers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;

    @Lob
    private String availability;

    @Lob
    private String motivation;

    private String status;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
