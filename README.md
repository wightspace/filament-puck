# Filament Puck

Filament v5 form field that embeds the [Puck](https://github.com/puckeditor/puck) visual page builder. Page content is stored as JSON on your Eloquent model (array/`json` cast).

Built on the [Filament plugin skeleton](https://filamentphp.com/docs/5.x/plugins/getting-started) as a **Forms** package (`filament/forms` only).

## Requirements

- PHP 8.2+
- Filament 5.x (Forms / Panel)
- Node 20+ (to rebuild frontend assets when customizing Puck components)

## Installation

```bash
composer require wight/filament-puck
```

Register Filament assets after installing or upgrading:

```bash
php artisan filament:assets
```

Optionally publish config:

```bash
php artisan vendor:publish --tag="filament-puck-config"
```

## Usage

Add the field to any Filament form schema:

```php
use Wight\FilamentPuck\Forms\Components\PuckEditor;

PuckEditor::make('body')
    ->columnSpanFull();
```

On your model, cast the attribute:

```php
protected function casts(): array
{
    return [
        'body' => 'array',
    ];
}
```

The field persists Puck document data (`root`, `content`, optional `zones`) compatible with [`@puckeditor/core` `Render`](https://github.com/puckeditor/puck).

## Custom Puck components

Puck component configs include React `render` functions, so they live in **JavaScript**, not PHP. This package ships a starter config in `resources/js/puck/default-config.jsx` (Heading + Text blocks).

To customize:

1. Edit `resources/js/puck/default-config.jsx` in this package (or fork and point Composer at your fork).
2. Run `npm install && npm run build` in the package root.
3. Run `php artisan filament:assets` in your Laravel app.

## Development

```bash
composer install
npm install
npm run build
composer test
```

## License

MIT.
# filament-puck
