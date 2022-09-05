import { derived, writable } from "svelte/store";
import { reflectAriaActivedescendent } from "./internal/aria-activedescendent";
import { reflectAriaControls, type Controllable } from './internal/aria-controls';
import { reflectAriaDisabled } from "./internal/aria-disabled";
import { defaultExpanded, focusOnClose, focusOnExpanded, reflectAriaExpanded, type Expandable } from "./internal/aria-expanded";
import { reflectAriaLabel, type Labelable } from "./internal/aria-label";
import { defaultSelected, reflectAriaSelected, type Selectable } from "./internal/aria-selected";
import { applyBehaviors } from "./internal/behavior";
import { keyCharacter } from "./internal/key-character";
import { keyEscape } from "./internal/key-escape";
import { keyHomeEnd } from "./internal/key-home-end";
import { keyUpDown } from "./internal/key-up-down";
import { keySpaceEnter } from "./internal/key-space-enter";
import { keyTab } from "./internal/key-tab";
import { defaultList, firstActive, getItemValues, lastActive, nextActive, onDestroy, previousActive, removeItem, removeOnDestroy, type ItemOptions, type List } from "./internal/list";
import { ensureID } from "./internal/new-id";
import { noop } from "./internal/noop";
import { onClick } from "./internal/on-click";
import { onClickOutside } from "./internal/on-click-outside";
import { onInput } from "./internal/on-input";
import { onKeydown } from "./internal/on-keydown";
import { onPointerMoveChild, onPointerOut } from "./internal/on-pointer-move";
import { setHasPopup } from "./internal/set-has-popup";
import { setRole } from "./internal/set-role";
import { setTabIndex } from "./internal/set-tab-index";
import { setType } from "./internal/set-type";

// TODO: add "value" selector, to pick text value off list item objects
export interface Combobox extends Labelable, Expandable, Controllable, List, Selectable {
  button?: string
  menu?: string
  filter: string
}

export function createCombobox(init?: Partial<Combobox>) {
  // prefix for generating unique IDs
  const prefix = 'headlessui-combobox'

  // internal state for component
  let state: Combobox = {
    ...defaultList,
    ...defaultExpanded,
    ...defaultSelected,
    ...init,
    filter: '',
  }

  // wrap with store for reactivity
  const store = writable(state)

  // update state and notify store of changes for reactivity
  const set = (part: Partial<Combobox>) => store.set(state = { ...state, ...part })

  // return active value
  const active = () => state.active === -1 || state.items.length === 0 ? undefined : state.active >= state.items.length ? state.items[state.active] : state.items[state.active].value

  // open the menu and set first item active
  const open = () => set({ expanded: true, active: state.items.findIndex(x => x.value === state.selected) })

  // close the menu
  const close = () => set({ expanded: false })

  // toggle open / closed state
  const toggle = () => state.expanded ? close() : open()

  // set focused (active) item only if changed
  const focus = (active: number) => state.active !== active && set({ active, expanded: true })

  // set focus (active) to first
  const first = () => focus(firstActive(state))

  // set focus (active) to previous
  const previous = () => focus(previousActive(state))

  // set focus (active) to next
  const next = () => focus(nextActive(state))

  // set focus (active) to last
  const last = () => focus(lastActive(state))

  // clear focus
  const none = () => focus(-1)

  const filter = (value: string) => set({ filter: value, expanded: true })

  // set the focus based on the HTMLElement passed which will be a menuitem element or null
  const focusNode = (node: HTMLElement | null) => focus(node ? state.items.findIndex(item => item.id === node.id && !item.disabled) : -1)

  const remove = (node: HTMLElement) => set(removeItem(state, node))

  // "two stage" dispatch is because button may be added last, but we want to wire behaviors to the method
  let onSelect = () => { }
  const select = () => onSelect()

  function input(node: HTMLElement) {
    ensureID(node, prefix)
    set({ button: node.id })

    // TODO: create a behavior that can be passed an event generator function, use with items select
    // to raise event from the 'controller'
    onSelect = () => {
      if (state.items[state.active].disabled) return
      const selected = active()
      set({ expanded: false, selected })
      const event = new CustomEvent('select', {
        detail: {
          selected,
        }
      })
      node.dispatchEvent(event)
    }

    const destroy = applyBehaviors(node, [
      setType('text'),
      setRole('combobox'),
      // setHasPopup(),
      setTabIndex(0),
      reflectAriaLabel(store),
      reflectAriaExpanded(store),
      reflectAriaControls(store),
      // onClick(toggle),
      // selectAllOnFocus(), <--
      onKeydown(
        keySpaceEnter(select),
        keyEscape(close),
        keyHomeEnd(first, last),
        keyUpDown(previous, next),
        keyTab(noop),
        // keyCharacter(search),
      ),
      onInput(filter),
      focusOnClose(store),
    ])

    return {
      destroy,
    }
  }

  // menubutton
  function button(node: HTMLElement) {
    ensureID(node, prefix)
    set({ button: node.id })

    const destroy = applyBehaviors(node, [
      setType('button'),
      setRole('button'),
      setHasPopup(),
      setTabIndex(-1),
      // reflectAriaLabel(store),
      reflectAriaExpanded(store),
      reflectAriaControls(store),
      onClick(toggle),
      // onKeydown(
      // keySpaceEnter(toggle),
      // keyPreviousNext(toggle, toggle),
      // ),
      // focusOnClose(store),
    ])

    return {
      destroy,
    }
  }

  function items(node: HTMLElement) {
    ensureID(node, prefix)
    set({ menu: node.id, controls: node ? node.id : undefined })

    const destroy = applyBehaviors(node, [
      setRole('listbox'),
      setTabIndex(-1),
      onClickOutside(close),
      onClick(select),
      onPointerMoveChild('[role="option"]', focusNode),
      onPointerOut(none),
      // onKeydown(
      //   keySpaceEnter(select),
      //   keyEscape(close),
      //   keyFirstLast(first, last),
      //   keyPreviousNext(previous, next),
      //   keyTab(noop),
      //   keyCharacter(search),
      // ),
      reflectAriaActivedescendent(store),
    ])

    return {
      destroy,
    }
  }

  // TODO: allow "any" type of value, as long as a text extractor is supplied (default function is treat as a string)
  // NOTE: text value is required for searchability
  function item(node: HTMLElement, options?: ItemOptions) {
    ensureID(node, prefix)

    const update = (options?: ItemOptions) => {
      const values = getItemValues(node, options)
      const item = state.items.find(item => item.id === node.id)
      if (item) {
        if (item.value === values.value && item.disabled === values.disabled) return
        Object.assign(item, values)
      } else {
        state.items.push({ id: node.id, ...values })
      }
      set({ items: state.items })
    }

    update(options)

    const destroy = applyBehaviors(node, [
      setTabIndex(-1),
      setRole('option'),
      reflectAriaDisabled(store),
      onDestroy(remove),
    ])

    return {
      update,
      destroy,
    }
  }

  // expose a subset of our state, derive the selected value
  const { subscribe } = derived(store, $state => {
    const { expanded, selected, filter } = $state
    return { expanded, selected, filter, active: active() }
  })

  return {
    subscribe,
    input,
    button,
    items,
    item,
  }
}
