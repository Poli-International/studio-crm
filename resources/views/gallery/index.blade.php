@extends('layouts.app')

@section('title', 'Studio Gallery')

@section('content')
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
    <div>
        <h1>Studio Gallery</h1>
        <p style="color:var(--text-muted)">Showcase and share your best work with clients.</p>
    </div>
    <div style="display:flex; gap:1rem;">
        <button class="btn btn-primary" onclick="document.getElementById('upload-gallery-modal').style.display='flex'">
            <i data-lucide="upload-cloud"></i> Upload Work
        </button>
    </div>
</div>

<!-- Search & Filter Bar -->
<div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
    <form action="{{ route('gallery.index') }}" method="GET" style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; align-items: end;">
        <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Search Keywords</label>
            <div style="position:relative">
                <i data-lucide="search" style="position:absolute; left:12px; top:10px; color:var(--text-muted); width:18px"></i>
                <input type="text" name="search" class="form-control" style="padding-left:2.5rem" placeholder="e.g. Traditional, Rose, Sleeve..." value="{{ request('search') }}">
            </div>
        </div>
        <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Filter by Artist</label>
            <select name="artist" class="form-control">
                <option value="">All Artists</option>
                @foreach($artists as $artist)
                    <option value="{{ $artist->id }}" {{ request('artist') == $artist->id ? 'selected' : '' }}>{{ $artist->name }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-outline" style="height:42px">Update View</button>
    </form>
</div>

<!-- Gallery Grid -->
<div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
    @forelse($posts as $post)
        <div class="card" style="padding:0; overflow:hidden; display:flex; flex-direction:column; height:100%">
            <!-- Image Area -->
            <div style="position:relative; height:250px; background:#000;">
                <img src="{{ asset('storage/' . $post->image_path) }}" alt="{{ $post->title }}" style="width:100%; height:100%; object-fit:cover;">
                <div style="position:absolute; bottom:0; left:0; width:100%; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding:1rem;">
                    <span style="color:white; font-size:0.75rem; background:var(--primary); padding:0.2rem 0.5rem; border-radius:4px; font-weight:600">
                        {{ $post->staff->name }}
                    </span>
                </div>
            </div>
            
            <!-- Content Area -->
            <div style="padding:1.5rem; flex:1; display:flex; flex-direction:column;">
                <h3 style="margin-bottom:0.5rem; font-size:1.1rem">{{ $post->title }}</h3>
                <p style="color:var(--text-muted); font-size:0.875rem; flex:1; margin-bottom:1rem;">
                    {{ Str::limit($post->description, 100) }}
                </p>
                <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
                    @if($post->tags)
                        @foreach(explode(',', $post->tags) as $tag)
                            <span style="font-size:0.7rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:0.1rem 0.4rem; border-radius:4px;">#{{ trim($tag) }}</span>
                        @endforeach
                    @endif
                </div>
                
                <!-- Share Actions -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:1rem; margin-top:auto;">
                    <span style="font-size:0.75rem; color:var(--text-muted)">{{ $post->created_at->format('M d, Y') }}</span>
                    
                    <div style="display:flex; gap:0.5rem">
                         <button class="btn btn-outline" style="padding:0.4rem; border:none" title="Share via Email"
                            onclick="window.location.href='mailto:?subject={{ urlencode($post->title) }} by {{ urlencode($post->staff->name) }}&body=Check out this work: {{ urlencode(asset('storage/' . $post->image_path)) }} - {{ urlencode($post->description) }}'">
                            <i data-lucide="mail" size="16"></i>
                        </button>
                        <button class="btn btn-outline" style="padding:0.4rem; border:none" title="Share on Facebook"
                            onclick="window.open('https://www.facebook.com/sharer/sharer.php?u={{ urlencode(asset('storage/' . $post->image_path)) }}', '_blank')">
                            <i data-lucide="facebook" size="16"></i>
                        </button>
                        <button class="btn btn-outline" style="padding:0.4rem; border:none" title="Share on Twitter"
                            onclick="window.open('https://twitter.com/intent/tweet?text={{ urlencode($post->title) }}&url={{ urlencode(asset('storage/' . $post->image_path)) }}', '_blank')">
                            <i data-lucide="twitter" size="16"></i>
                        </button>
                        <button class="btn btn-outline" style="padding:0.4rem; border:none" title="Share on LinkedIn"
                            onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url={{ urlencode(asset('storage/' . $post->image_path)) }}', '_blank')">
                            <i data-lucide="linkedin" size="16"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @empty
        <div style="grid-column: 1/-1; text-align:center; padding:4rem; color:var(--text-muted)">
            <i data-lucide="image" size="48" style="opacity:0.5; margin-bottom:1rem"></i>
            <p>No gallery items found. Upload your first masterpiece!</p>
        </div>
    @endforelse
</div>

<div style="margin-top:2rem">
    {{ $posts->links() }}
</div>

<!-- Upload Modal -->
<div id="upload-gallery-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); align-items:center; justify-content:center; z-index:2000">
    <div class="card" style="width:100%; max-width:500px; padding:2rem">
        <h2 style="margin-bottom:1.5rem">Upload to Gallery</h2>
        <form action="{{ route('gallery.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label class="form-label">Work Title</label>
                <input type="text" name="title" class="form-control" placeholder="e.g. Neo-Japanese Dragon" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Upload Image</label>
                <input type="file" name="image" class="form-control" accept="image/*" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-control" rows="4" placeholder="Describe the style, technique, or story..." required></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Tags (Keywords)</label>
                <input type="text" name="tags" class="form-control" placeholder="comma, separated, tags">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem">
                <button type="button" class="btn btn-outline" onclick="document.getElementById('upload-gallery-modal').style.display='none'">Cancel</button>
                <button type="submit" class="btn btn-primary">Upload to Gallery</button>
            </div>
        </form>
    </div>
</div>
@endsection
