<?php

namespace Wight\FilamentPuck\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Wight\FilamentPuck\FilamentPuck
 */
class FilamentPuck extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Wight\FilamentPuck\FilamentPuck::class;
    }
}
