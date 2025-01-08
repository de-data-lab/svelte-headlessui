import * as svelte_store from 'svelte/store';

interface Controllable {
    controls?: string;
}

interface Expandable {
    expanded: boolean;
    opened: boolean;
}

interface Labelable {
    label?: string;
}

interface Selectable {
    selected: any;
    multi: boolean;
}

interface ItemOptions {
    value?: any;
    disabled?: boolean;
}
interface ListItem {
    id: string;
    node: HTMLElement;
    text: string;
    value: any;
    disabled: boolean;
}
interface List {
    items: ListItem[];
    active: number;
}

interface Combobox extends Labelable, Expandable, Controllable, List, Selectable {
    input?: HTMLInputElement;
    button?: HTMLElement;
    filter: string;
    moved: boolean;
}
declare function createCombobox(init?: Partial<Combobox>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
        selected: any;
        filter: string;
        active: any;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
        selected: any;
        filter: string;
        active: any;
    }> | undefined) => svelte_store.Unsubscriber;
    input: (node: HTMLInputElement) => {
        destroy: () => void;
    };
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    items: (node: HTMLElement) => {
        destroy: () => void;
    };
    item: (node: HTMLElement, options?: ItemOptions) => {
        update: (options?: ItemOptions) => void;
        destroy: () => void;
    };
    deselect: (node: HTMLElement, value: any) => {
        destroy: () => void;
    };
    reset: () => void;
    open: () => void;
    close: () => void;
    set: (part: Partial<Combobox>) => void;
};

interface Dialog extends Expandable, Labelable {
}
declare function createDialog(init?: Partial<Dialog>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
    }> | undefined) => svelte_store.Unsubscriber;
    modal: (node: HTMLElement) => {
        destroy: () => void;
    };
    open: () => void;
    close: () => void;
    set: (part: Partial<Dialog>) => void;
};

interface Disclosure extends Labelable, Expandable, Controllable {
    button?: string;
    panel?: string;
}
declare function createDisclosure(init?: Partial<Disclosure>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
    }> | undefined) => svelte_store.Unsubscriber;
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    panel: (node: HTMLElement) => {
        destroy: () => void;
    };
    open: () => void;
    close: () => void;
    set: (part: Partial<Disclosure>) => void;
};

interface Listbox extends Labelable, Expandable, Controllable, List, Selectable {
    button?: HTMLElement;
}
declare function createListbox(init?: Partial<Listbox>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
        selected: any;
        active: any;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
        selected: any;
        active: any;
    }> | undefined) => svelte_store.Unsubscriber;
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    items: (node: HTMLElement) => {
        destroy: () => void;
    };
    item: (node: HTMLElement, options?: ItemOptions) => {
        update: (options?: ItemOptions) => void;
        destroy: () => void;
    };
    deselect: (node: HTMLElement, value: any) => {
        destroy: () => void;
    };
    open: () => void;
    close: () => void;
    set: (part: Partial<Listbox>) => void;
};

interface Menu extends Labelable, Expandable, Controllable, List, Selectable {
    button?: HTMLElement;
}
declare function createMenu(init?: Partial<Menu>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
        active: any;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
        active: any;
    }> | undefined) => svelte_store.Unsubscriber;
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    items: (node: HTMLElement) => {
        destroy: () => void;
    };
    item: (node: HTMLElement, options?: ItemOptions) => {
        update: (options?: ItemOptions) => void;
        destroy: () => void;
    };
    open: () => void;
    close: () => void;
    set: (part: Partial<Menu>) => void;
};

interface Popover extends Labelable, Expandable, Controllable {
    button?: HTMLElement;
    panel?: string;
}
declare function createPopover(init?: Partial<Popover>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        expanded: boolean;
    }>, invalidate?: svelte_store.Invalidator<{
        expanded: boolean;
    }> | undefined) => svelte_store.Unsubscriber;
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    panel: (node: HTMLElement) => {
        destroy: () => void;
    };
    open: () => void;
    close: () => void;
    set: (part: Partial<Popover>) => void;
};

type Orientation = 'horizontal' | 'vertical';
interface Orientable {
    orientation: Orientation;
}

interface Tabs extends Labelable, List, Selectable, Orientable {
    tabs: HTMLElement[];
    panels: HTMLElement[];
    auto: boolean;
}
declare function createTabs(init?: Partial<Tabs>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        selected: any;
        active: any;
    }>, invalidate?: svelte_store.Invalidator<{
        selected: any;
        active: any;
    }> | undefined) => svelte_store.Unsubscriber;
    list: (node: HTMLElement) => {
        destroy: () => void;
    };
    tab: (node: HTMLElement, options?: ItemOptions) => {
        destroy: () => void;
    };
    panel: (node: HTMLElement) => {
        destroy: () => void;
    };
    set: (part: Partial<Tabs>) => void;
};

interface Checkable {
    checked: boolean;
}

interface Pressable {
    pressed: boolean;
}

interface Switch extends Labelable, Checkable, Pressable {
}
declare function createSwitch(init?: Partial<Switch>): {
    subscribe: (this: void, run: svelte_store.Subscriber<{
        checked: boolean;
        pressed: boolean;
    }>, invalidate?: svelte_store.Invalidator<{
        checked: boolean;
        pressed: boolean;
    }> | undefined) => svelte_store.Unsubscriber;
    button: (node: HTMLElement) => {
        destroy: () => void;
    };
    toggle: (node: HTMLElement) => {
        destroy: () => void;
    };
    set: (part: Partial<Switch>) => void;
};

export { type Combobox, type Dialog, type Disclosure, type Listbox, type Menu, type Popover, type Switch, type Tabs, createCombobox, createDialog, createDisclosure, createListbox, createMenu, createPopover, createSwitch, createTabs };
