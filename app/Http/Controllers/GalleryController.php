<?php

namespace App\Http\Controllers;

use App\Models\GalleryPost;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        // Self-Healing Database Logic: Create table if missing
        try {
            // Lightweight check to see if table exists by trying to access it
            \Illuminate\Support\Facades\DB::select("SELECT 1 FROM gallery_posts LIMIT 1");
        } catch (\Exception $e) {
            // Table likely doesn't exist, create it
            \Illuminate\Support\Facades\DB::statement("
                CREATE TABLE IF NOT EXISTS `gallery_posts` (
                  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `staff_id` INT UNSIGNED NOT NULL,
                  `title` VARCHAR(255) NULL,
                  `description` TEXT NULL,
                  `image_path` VARCHAR(255) NOT NULL,
                  `tags` VARCHAR(255) NULL COMMENT 'Comma separated keywords',
                  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`)
                ) ENGINE = InnoDB;
            ");
        }

        $query = GalleryPost::with('staff')->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%")
                  ->orWhereHas('staff', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('artist') && $request->artist != '') {
            $query->where('staff_id', $request->artist);
        }

        $posts = $query->paginate(12);
        $artists = Staff::where('active', 1)->orderBy('name')->get();

        return view('gallery.index', compact('posts', 'artists'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        GalleryPost::create([
            'staff_id' => session('user_id') ?? 1, // Fallback to 1 if session lost in dev
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $path,
            'tags' => $validated['tags'],
        ]);

        return redirect()->back()->with('success', 'Work uploaded to gallery successfully!');
    }
}
