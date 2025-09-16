<?php

namespace App\Services;

class NlpService
{
    protected $intentPatterns = [
        'greeting' => [
            'keywords' => ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
            'responses' => [
                ['text' => 'Hello! How can I assist you today?'],
                ['text' => 'Hi there! What can I help you with?'],
                ['text' => 'Greetings! How may I help you?'],
            ],
        ],
        'login' => [
            'keywords' => ['how to login', 'sign in', 'access account', 'login', 'log in', 'logging in'],
            'responses' => [
                [
                    'text' => 'You can log in to your account here.',
                    'link' => '/login',
                    'linkText' => 'Go to Login Page',
                ],
            ],
        ],
        'register' => [
            'keywords' => ['how to register', 'create account', 'sign up', 'register', 'registration', 'signup'],
            'responses' => [
                [
                    'text' => 'You can create an account here.',
                    'link' => '/register',
                    'linkText' => 'Go to Register Page',
                ],
            ],
        ],
        'alerts' => [
            'keywords' => ['alerts', 'disaster alerts', 'warnings', 'emergency alerts', 'notifications'],
            'responses' => [
                [
                    'text' => 'See the latest disaster alerts and emergency notifications.',
                    'link' => '/alerts',
                    'linkText' => 'View Alerts',
                ],
            ],
        ],
        'relief' => [
            'keywords' => ['relief', 'help centers', 'relief work', 'assistance', 'aid', 'support'],
            'responses' => [
                [
                    'text' => 'Find information about relief services and assistance.',
                    'link' => '/relief',
                    'linkText' => 'View Relief Page',
                ],
            ],
        ],
        'safeguard' => [
            'keywords' => ['safety tips', 'safeguard', 'protection', 'safety', 'secure', 'preparedness'],
            'responses' => [
                [
                    'text' => 'Check out safety and safeguard measures for disaster preparedness.',
                    'link' => '/safeguard',
                    'linkText' => 'View Safeguard Page',
                ],
            ],
        ],
        'report' => [
            'keywords' => ['report disaster', 'file a report', 'incident report', 'report', 'reporting', 'submit report'],
            'responses' => [
                [
                    'text' => 'You can report a disaster or incident here.',
                    'link' => '/report',
                    'linkText' => 'Report Disaster',
                ],
            ],
        ],
        'donation' => [
            'keywords' => ['donate', 'donation', 'help people', 'contribute', 'giving', 'charity', 'how can i donate', 'want to donate'],
            'responses' => [
                [
                    'text' => 'Choose how you want to help by donating money, blood, or goods.',
                    'link' => '/donate',
                    'linkText' => 'Go to Donation Page',
                ],
            ],
        ],
        'donateMoney' => [
            'keywords' => ['donate money', 'send funds', 'help financially', 'money donation', 'financial help'],
            'responses' => [
                [
                    'text' => 'You can donate money to help disaster victims.',
                    'link' => '/donate-money',
                    'linkText' => 'Donate Money',
                ],
            ],
        ],
        'donateBlood' => [
            'keywords' => ['donate blood', 'blood donation', 'give blood', 'blood donor'],
            'responses' => [
                [
                    'text' => 'You can register as a blood donor here.',
                    'link' => '/donate-blood',
                    'linkText' => 'Donate Blood',
                ],
            ],
        ],
        'donateGoods' => [
            'keywords' => ['donate goods', 'help with items', 'supplies', 'donate items', 'goods donation', 'essential items'],
            'responses' => [
                [
                    'text' => 'You can donate essential goods and supplies here.',
                    'link' => '/donate-goods',
                    'linkText' => 'Donate Goods',
                ],
            ],
        ],
        'profile' => [
            'keywords' => ['my profile', 'profile page', 'user profile', 'account details'],
            'responses' => [
                [
                    'text' => 'Access your profile and account details here.',
                    'link' => '/profile',
                    'linkText' => 'Go to Profile',
                ],
            ],
        ],
        'editProfile' => [
            'keywords' => ['edit profile', 'update profile', 'change profile', 'modify profile'],
            'responses' => [
                [
                    'text' => 'You can edit your profile details here.',
                    'link' => '/profile',
                    'linkText' => 'Edit Profile',
                ],
            ],
        ],
        'myReports' => [
            'keywords' => ['my reports', 'see my reports', 'submitted reports', 'report history'],
            'responses' => [
                [
                    'text' => 'You can see all your submitted reports here.',
                    'link' => '/profile',
                    'linkText' => 'View My Reports',
                ],
            ],
        ],
        'shelter' => [
            'keywords' => ['shelter', 'shelters', 'view shelters', 'emergency shelter', 'safe place'],
            'responses' => [
                [
                    'text' => 'You can check out available emergency shelters in your area here.',
                    'link' => '/shelter',
                    'linkText' => 'View Shelters',
                ],
            ],
        ],
        'volunteers' => [
            'keywords' => ['volunteers', 'helping people', 'join volunteers', 'volunteer work', 'become volunteer'],
            'responses' => [
                [
                    'text' => 'Find information about volunteers and join our community.',
                    'link' => '/volunteers',
                    'linkText' => 'View Volunteers',
                ],
            ],
        ],
        'contactUs' => [
            'keywords' => ['contact', 'contact us', 'support', 'help desk', 'customer service', 'get in touch'],
            'responses' => [
                [
                    'text' => 'You can reach out to us for support and assistance.',
                    'link' => '/contact-us',
                    'linkText' => 'Contact Us',
                ],
            ],
        ],
        'goodbye' => [
            'keywords' => ['bye', 'thanks', 'thank you', 'ok', 'goodbye', 'see you', 'that\'s all'],
            'responses' => [
                ['text' => 'You\'re welcome! Feel free to ask anything else.'],
                ['text' => 'Thank you for using HopeBridge! Have a great day!'],
                ['text' => 'Goodbye! I\'m here whenever you need help.'],
            ],
        ],
    ];

    public function detectIntent(string $message): ?string
    {
        $message = strtolower(trim($message));
        $bestIntent = null;
        $bestScore = 0;

        foreach ($this->intentPatterns as $intent => $data) {
            foreach ($data['keywords'] as $keyword) {
                $keyword = strtolower($keyword);
                
                // Method 1: Direct substring check (most reliable)
                if (strpos($message, $keyword) !== false) {
                    // Calculate score based on keyword length and position
                    $keywordLength = strlen($keyword);
                    $messageLength = strlen($message);
                    $position = strpos($message, $keyword);
                    
                    // Higher score for longer keywords and earlier positions
                    $score = ($keywordLength / $messageLength) * 100 + (100 - $position);
                    
                    if ($score > $bestScore) {
                        $bestScore = $score;
                        $bestIntent = $intent;
                    }
                    continue; // Move to next keyword since we found a match
                }
                
                // Method 2: Word-based matching for partial matches
                $messageWords = explode(' ', $message);
                $keywordWords = explode(' ', $keyword);
                
                $matchCount = 0;
                foreach ($keywordWords as $keywordWord) {
                    foreach ($messageWords as $messageWord) {
                        // Check for exact word match or similar words
                        if ($keywordWord === $messageWord || 
                            (strlen($keywordWord) > 3 && strpos($messageWord, $keywordWord) !== false) ||
                            (strlen($messageWord) > 3 && strpos($keywordWord, $messageWord) !== false)) {
                            $matchCount++;
                            break;
                        }
                    }
                }
                
                // Calculate match percentage
                $matchPercentage = ($matchCount / count($keywordWords)) * 100;
                
                if ($matchPercentage >= 70 && $matchPercentage > $bestScore) {
                    $bestScore = $matchPercentage;
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
            'text' => 'I didn\'t fully understand that. You can ask me about:\n• Login and Registration\n• Disaster Alerts\n• Donations (money, blood, goods)\n• Reporting disasters\n• Relief services\n• Safety tips\n• Shelters and Volunteers\n• Contact support',
            'link' => null,
            'linkText' => null,
        ];
    }

    // Additional helper method for fuzzy matching
    private function calculateSimilarity(string $str1, string $str2): float
    {
        $str1 = strtolower($str1);
        $str2 = strtolower($str2);
        
        // Levenshtein distance for short strings
        if (strlen($str1) < 10 && strlen($str2) < 10) {
            $distance = levenshtein($str1, $str2);
            $maxLen = max(strlen($str1), strlen($str2));
            return (1 - $distance / $maxLen) * 100;
        }
        
        // Similar text for longer strings
        similar_text($str1, $str2, $percent);
        return $percent;
    }
}
