<?php

namespace Wight\FilamentPuck\Commands;

use Illuminate\Console\Command;

class FilamentPuckCommand extends Command
{
    public $signature = 'filament-puck';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
