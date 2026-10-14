<?php

namespace Wight\FilamentPuck\Forms\Components\Concerns;

use Closure;

trait CanOpenInSlideOver
{
    protected bool | Closure $isSlideOver = false;

    protected string | Closure | null $openButtonLabel = null;

    protected string | Closure | null $modalHeading = null;

    protected string | Closure | null $modalDescription = null;

    public function slideOver(bool | Closure $condition = true): static
    {
        $this->isSlideOver = $condition;

        return $this;
    }

    public function inline(bool | Closure $condition = true): static
    {
        $this->isSlideOver = fn (): bool => ! $this->evaluate($condition);

        return $this;
    }

    public function isSlideOver(): bool
    {
        return (bool) $this->evaluate($this->isSlideOver);
    }

    public function openButtonLabel(string | Closure | null $label): static
    {
        $this->openButtonLabel = $label;

        return $this;
    }

    public function getOpenButtonLabel(): string
    {
        return $this->evaluate($this->openButtonLabel) ?? __('filament-puck::puck.actions.open');
    }

    public function modalHeading(string | Closure | null $heading): static
    {
        $this->modalHeading = $heading;

        return $this;
    }

    public function getModalHeading(): string
    {
        return $this->evaluate($this->modalHeading) ?? __('filament-puck::puck.modal.heading');
    }

    public function modalDescription(string | Closure | null $description): static
    {
        $this->modalDescription = $description;

        return $this;
    }

    public function getModalDescription(): ?string
    {
        return $this->evaluate($this->modalDescription);
    }

    public function getModalId(): string
    {
        $key = str_replace(['.', '[', ']'], '-', $this->getName());

        return 'fi-puck-editor-' . $key;
    }
}
