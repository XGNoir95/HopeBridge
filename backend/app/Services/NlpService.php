<?php

namespace App\Services;

class NlpService
{
    protected $intentPatterns = [
        'greeting' => [
            'keywords' => ['hello', 'hi', 'hey', 'greetings'],
            'responses' => [
                ['text' => 'Hello! How can I assist you today?'],
            ],
        ],
        'login' => [
            'keywords' => ['how to login', 'sign in', 'access account'],
            'responses' => [
                [
                    'text' => 'You can log in to your account here.',
                    'link' => '/login',
                    'linkText' => 'Go to Login Page',
                ],
            ],
        ],
        'register' => [
            'keywords' => ['how to register', 'create account', 'sign up'],
            'responses' => [
                [
                    'text' => 'You can create an account here.',
                    'link' => '/register',
                    'linkText' => 'Go to Register Page',
                ],
            ],
        ],
        'alerts' => [
            'keywords' => ['alerts', 'disaster alerts', 'warnings'],
            'responses' => [
                [
                    'text' => 'See the latest disaster alerts.',
                    'link' => '/alerts',
                    'linkText' => 'View Alerts',
                ],
            ],
        ],
        'relief' => [
            'keywords' => ['relief', 'help centers', 'relief work'],
            'responses' => [
                [
                    'text' => 'Find information about relief services.',
                    'link' => '/relief',
                    'linkText' => 'View Relief Page',
                ],
            ],
        ],
        'safeguard' => [
            'keywords' => ['safety tips', 'safeguard', 'protection'],
            'responses' => [
                [
                    'text' => 'Check out safety and safeguard measures.',
                    'link' => '/safeguard',
                    'linkText' => 'View Safeguard Page',
                ],
            ],
        ],
        'report' => [
            'keywords' => ['report disaster', 'file a report', 'incident report'],
            'responses' => [
                [
                    'text' => 'You can report an incident here.',
                    'link' => '/report',
                    'linkText' => 'Report Disaster',
                ],
            ],
        ],
        'donation' => [
            'keywords' => ['donate', 'donation', 'help people'],
            'responses' => [
                [
                    'text' => 'Choose how you want to help by donating.',
                    'link' => '/donate',
                    'linkText' => 'Go to Donation Page',
                ],
            ],
        ],
        'donateMoney' => [
            'keywords' => ['donate money', 'send funds', 'help financially'],
            'responses' => [
                [
                    'text' => 'You can donate money here.',
                    'link' => '/donate-money',
                    'linkText' => 'Donate Money',
                ],
            ],
        ],
        'donateBlood' => [
            'keywords' => ['donate blood', 'blood donation'],
            'responses' => [
                [
                    'text' => 'You can donate blood here.',
                    'link' => '/donate-blood',
                    'linkText' => 'Donate Blood',
                ],
            ],
        ],
        'donateGoods' => [
            'keywords' => ['donate goods', 'help with items', 'supplies'],
            'responses' => [
                [
                    'text' => 'You can donate essential goods here.',
                    'link' => '/donate-goods',
                    'linkText' => 'Donate Goods',
                ],
            ],
        ],
        'profile' => [
            'keywords' => ['my profile', 'profile page'],
            'responses' => [
                [
                    'text' => 'Access your profile here.',
                    'link' => '/profile',
                    'linkText' => 'Go to Profile',
                ],
            ],
        ],
        'editProfile' => [
            'keywords' => ['edit profile', 'update profile'],
            'responses' => [
                [
                    'text' => 'You can edit your profile details here.',
                    'link' => '/edit-profile',
                    'linkText' => 'Edit Profile',
                ],
            ],
        ],
        'myReports' => [
            'keywords' => ['my reports', 'see my reports'],
            'responses' => [
                [
                    'text' => 'You can see all your submitted reports here.',
                    'link' => '/my-reports',
                    'linkText' => 'View My Reports',
                ],
            ],
        ],
        'adminDashboard' => [
            'keywords' => ['admin', 'admin dashboard'],
            'responses' => [
                [
                    'text' => 'Admin dashboard is here.',
                    'link' => '/admin-dashboard',
                    'linkText' => 'Go to Admin Dashboard',
                ],
            ],
        ],
        'allReports' => [
            'keywords' => ['all reports', 'see all reports'],
            'responses' => [
                [
                    'text' => 'Admins can see all reports here.',
                    'link' => '/all-reports',
                    'linkText' => 'View All Reports',
                ],
            ],
        ],
        'uploadVlogs' => [
            'keywords' => ['upload vlogs', 'add vlog'],
            'responses' => [
                [
                    'text' => 'Upload your vlogs here.',
                    'link' => '/upload-vlogs',
                    'linkText' => 'Upload Vlogs',
                ],
            ],
        ],
        'volunteers' => [
            'keywords' => ['volunteers', 'helping people', 'join volunteers'],
            'responses' => [
                [
                    'text' => 'Find information about volunteers here.',
                    'link' => '/volunteers',
                    'linkText' => 'View Volunteers',
                ],
            ],
        ],
        'contactUs' => [
            'keywords' => ['contact', 'contact us', 'support'],
            'responses' => [
                [
                    'text' => 'You can reach out to us here.',
                    'link' => '/contact-us',
                    'linkText' => 'Contact Us',
                ],
            ],
        ],
        'goodbye' => [
            'keywords' => ['bye', 'thanks', 'thank you', 'ok'],
            'responses' => [
                ['text' => 'You\'re welcome! Feel free to ask anything else.'],
            ],
        ],
    ];

    public function detectIntent(string $message): ?string
    {
        $bestIntent = null;
        $bestScore = 0;

        foreach ($this->intentPatterns as $intent => $data) {
            foreach ($data['keywords'] as $keyword) {
                similar_text(strtolower($message), strtolower($keyword), $percent);
                if ($percent > $bestScore && $percent > 60) {
                    $bestScore = $percent;
                    $bestIntent = $intent;
                }
            }
        }

        return $bestIntent;
    }

    public function generateResponse(?string $intent): array
    {
        if ($intent && isset($this->intentPatterns[$intent])) {
            $responses = $this->intentPatterns[$intent]['responses'];
            return $responses[array_rand($responses)];
        }

        return [
            'text' => 'I didn\'t fully understand that. You can ask me about login, register, donations, reports, or contact us.',
            'link' => null,
            'linkText' => null,
        ];
    }
}
