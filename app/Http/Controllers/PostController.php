<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PostResource;
use App\Post;

class PostController extends Controller
{
    const DEFAULT_PAGE_SIZE = 15;
    const DEFAULT_SORT = 'id';
    const DEFAULT_ORDER = 'asc';

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $pageSize = $request->get('page_size', self::DEFAULT_PAGE_SIZE);
        $sort = $request->get('sort', self::DEFAULT_SORT);
        $order = $request->get('order', self::DEFAULT_ORDER);

        $posts = DB::table('posts')
            ->orderBy($sort, $order)
            ->paginate(intval($pageSize));
        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'body' => $request->description
        ]);

        return new PostResource($post);
    }

    /**
     * Display the specified resource.
     *
     * @param  Post $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Post $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        if($request->user()->id !== $post->user_id) {
            return response()->json(['error' => 'You can only edit your own post.']);
        }

        $post->update($request->only(['title', 'body']));

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Post $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
