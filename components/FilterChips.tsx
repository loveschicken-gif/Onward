type ChipKey = keyof Omit<UserControls, "languageMode" | "titleLevel">;

const CHIPS: ChipKey[] = [/* your chip keys here */];

function toggle(key: ChipKey) {
    // toggle function implementation
}