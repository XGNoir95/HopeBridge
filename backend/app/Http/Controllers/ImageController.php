<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Get the uploaded files
        $files = $request->file('files');

        if ($files && is_array($files)) {
            $urls = [];
            foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                // Access the URL from the result object
                $urls[] = $result->getSecurePath();
            }
            return response()->json(['success' => true, 'urls' => $urls]);
        }
        return response()->json(['success' => false, 'message' => 'No files uploaded']);
    }
}
