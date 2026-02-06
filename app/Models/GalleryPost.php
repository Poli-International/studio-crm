<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryPost extends Model
{
    use HasFactory;

    protected $table = 'gallery_posts';

    protected $fillable = [
        'staff_id',
        'title',
        'description',
        'image_path',
        'tags',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
