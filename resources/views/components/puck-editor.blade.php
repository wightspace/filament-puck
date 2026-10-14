@php
    use Filament\Support\Facades\FilamentAsset;
    use Illuminate\Support\Js;

    $id = $field->getId();
    $isDisabled = $field->isDisabled();
    $statePath = $field->getStatePath();
    $livewireKey = $field->getLivewireKey();
    $modalId = $field->getModalId();
    $puckMountElementId = $field->getPuckMountElementId();
    $isSlideOver = $field->isSlideOver();
    $openButtonLabel = $field->getOpenButtonLabel();
    $modalHeading = $field->getModalHeading();
    $modalDescription = $field->getModalDescription();
@endphp

<div
    aria-labelledby="{{ $id }}-label"
    id="{{ $id }}"
    role="group"
    x-load
    x-load-src="{{ FilamentAsset::getAlpineComponentSrc('puck-editor', 'wightspace/filament-puck') }}"
    x-data="puckEditorFormComponent({
                displayMode: @js($isSlideOver ? 'slideOver' : 'inline'),
                modalId: @js($modalId),
                mountElementId: @js($puckMountElementId),
                isDisabled: @js($isDisabled),
                stylesheetHref: @js(FilamentAsset::getStyleHref('puck-editor', 'wightspace/filament-puck')),
                state: $wire.{{ $field->applyStateBindingModifiers("\$entangle('{$statePath}')", isOptimisticallyLive: false) }},
            })"
    wire:key="{{ $livewireKey }}.{{ substr(md5(serialize([$isDisabled, $isSlideOver])), 0, 64) }}"
    {{ $field->getExtraAttributeBag()->class(['fi-fo-puck-editor']) }}
>
    @if ($isSlideOver)
        <div
            class="fi-puck-editor-launcher flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 px-6 py-16 dark:border-gray-600"
        >
            <div class="text-center">
                <p class="text-sm font-medium text-gray-950 dark:text-white">
                    {{ __('filament-puck::puck.launcher.title') }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" x-text="summaryText"></p>
            </div>

            <x-filament::button
                type="button"
                size="sm"
                :disabled="$isDisabled"
                class="fi-ac-btn-action fi-btn fi-size-sm"
                x-on:click="openBuilder()"
            >
                {{ $openButtonLabel }}
            </x-filament::button>
        </div>

        <x-filament::modal
            :heading="$modalHeading"
            :description="filled($modalDescription) ? $modalDescription : null"
            :id="$modalId"
            :slide-over="true"
            width="screen"
            teleport="body"
            :close-by-clicking-away="false"
            sticky-header
        >
            <div
                wire:ignore
                id="{{ $puckMountElementId }}"
                class="fi-puck-editor-canvas min-h-[calc(100vh-12rem)] w-full"
            ></div>

            <x-slot name="footer">
                <div class="flex w-full justify-end gap-3">
                    <x-filament::button
                        type="button"
                        x-on:click="$dispatch(@js('close-modal'), { id: @js($modalId) })"
                    >
                        {{ __('filament-puck::puck.actions.done') }}
                    </x-filament::button>
                </div>
            </x-slot>
        </x-filament::modal>
    @else
        <div wire:ignore id="{{ $puckMountElementId }}" class="min-h-[32rem] w-full"></div>
    @endif
</div>
