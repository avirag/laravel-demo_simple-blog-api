<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\UserResource;
use App\User;

class UserController extends Controller
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

        $users = DB::table('users')
            ->orderBy($sort, $order)
            ->paginate(intval($pageSize));
        return UserResource::collection($users);
    }

    /**
     * Display the specified resource.
     *
     * @param  User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }
}
