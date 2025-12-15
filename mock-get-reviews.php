<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$role = isset($_GET['role']) ? $_GET['role'] : 'driver';

// Mock review data
$mock_reviews = [
    1 => [
        'driver' => [
            [
                'review_id' => 1,
                'rating' => 5,
                'user_name' => 'Sarah Johnson',
                'review_text' => 'Excellent driver! Very punctual and professional. Made our trip comfortable and safe.',
                'date' => '2024-01-15'
            ],
            [
                'review_id' => 2,
                'rating' => 5,
                'user_name' => 'Michael Chen',
                'review_text' => 'Cabral is amazing! Safe, reliable, and knows all the best routes around Negombo.',
                'date' => '2024-01-10'
            ],
            [
                'review_id' => 3,
                'rating' => 4,
                'user_name' => 'Emma Wilson',
                'review_text' => 'Good service and clean vehicle. Would recommend for city tours.',
                'date' => '2024-01-08'
            ]
        ]
    ],
    2 => [
        'driver' => [
            [
                'review_id' => 4,
                'rating' => 4,
                'user_name' => 'David Kumar',
                'review_text' => 'Professional service with luxury vehicle. Perfect for business meetings.',
                'date' => '2024-01-14'
            ],
            [
                'review_id' => 5,
                'rating' => 5,
                'user_name' => 'Lisa Zhang',
                'review_text' => 'Silva provided excellent VIP service. Comfortable ride and great knowledge of Colombo.',
                'date' => '2024-01-09'
            ]
        ]
    ],
    3 => [
        'driver' => [
            [
                'review_id' => 6,
                'rating' => 5,
                'user_name' => 'Jennifer Lee',
                'review_text' => 'Perfect for our family group tour! Fernando was patient with the kids.',
                'date' => '2024-01-11'
            ],
            [
                'review_id' => 7,
                'rating' => 5,
                'user_name' => 'Mark Thompson',
                'review_text' => 'Excellent van driver for our group of 8. Smooth ride through the hill country.',
                'date' => '2024-01-07'
            ]
        ]
    ],
    4 => [
        'driver' => [
            [
                'review_id' => 8,
                'rating' => 4,
                'user_name' => 'Chris Williams',
                'review_text' => 'Good knowledge of hill country routes. Took us to amazing tea estate viewpoints.',
                'date' => '2024-01-06'
            ],
            [
                'review_id' => 9,
                'rating' => 3,
                'user_name' => 'Maria Santos',
                'review_text' => 'Decent service for mountain driving. Safe driver but could improve communication.',
                'date' => '2024-01-04'
            ]
        ]
    ],
    5 => [
        'guide' => [
            [
                'review_id' => 10,
                'rating' => 5,
                'user_name' => 'Jessica Adams',
                'review_text' => 'Ayesha is an amazing cultural guide! Her knowledge of ancient temples is exceptional.',
                'date' => '2024-01-12'
            ],
            [
                'review_id' => 11,
                'rating' => 5,
                'user_name' => 'Thomas Lee',
                'review_text' => 'Perfect guide for Buddhist heritage tours. Very knowledgeable and patient.',
                'date' => '2024-01-09'
            ]
        ]
    ],
    6 => [
        'guide' => [
            [
                'review_id' => 12,
                'rating' => 4,
                'user_name' => 'Rachel Green',
                'review_text' => 'Great wildlife safari guide! Rohan spotted so many animals for us.',
                'date' => '2024-01-08'
            ],
            [
                'review_id' => 13,
                'rating' => 4,
                'user_name' => 'Alex Brown',
                'review_text' => 'Excellent bird watching guide. Very knowledgeable about national parks.',
                'date' => '2024-01-05'
            ]
        ]
    ],
    7 => [
        'guide' => [
            [
                'review_id' => 14,
                'rating' => 5,
                'user_name' => 'Sophie Miller',
                'review_text' => 'Priya is fantastic! Her knowledge of Dutch colonial history is outstanding.',
                'date' => '2024-01-10'
            ],
            [
                'review_id' => 15,
                'rating' => 5,
                'user_name' => 'Daniel Kim',
                'review_text' => 'Perfect coastal heritage guide. Made our Galle trip unforgettable.',
                'date' => '2024-01-07'
            ]
        ]
    ],
    8 => [
        'guide' => [
            [
                'review_id' => 16,
                'rating' => 4,
                'user_name' => 'Amanda Clark',
                'review_text' => 'Good hill country guide. Nimal knows all the best hiking spots around Ella.',
                'date' => '2024-01-06'
            ],
            [
                'review_id' => 17,
                'rating' => 4,
                'user_name' => 'John Davis',
                'review_text' => 'Great waterfall tours and tea factory visits. Very informative guide.',
                'date' => '2024-01-03'
            ]
        ]
    ]
];

// Get reviews for the specific user and role
$reviews = [];
if (isset($mock_reviews[$user_id]) && isset($mock_reviews[$user_id][$role])) {
    $reviews = $mock_reviews[$user_id][$role];
}

// Calculate average rating
$total_rating = 0;
$total_reviews = count($reviews);
if ($total_reviews > 0) {
    foreach ($reviews as $review) {
        $total_rating += $review['rating'];
    }
    $average_rating = round($total_rating / $total_reviews, 1);
} else {
    $average_rating = 0;
}

// Return response
echo json_encode([
    'success' => true,
    'reviews' => $reviews,
    'average_rating' => $average_rating,
    'total_reviews' => $total_reviews,
    'user_id' => $user_id,
    'role' => $role
]);
