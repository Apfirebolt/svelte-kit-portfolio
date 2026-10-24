<script lang="ts">
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import logoSrc from "$lib/assets/logo.png";

  export let title: string = "SvelteKit Portfolio";

  const menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Gallery", url: "/gallery" },
  ];

  const themes = [
    { id: "theme-midnight", name: "Midnight", icon: "mdi:moon-waning-crescent" },
    { id: "theme-sunset", name: "Sunset", icon: "mdi:weather-sunset" },
    { id: "theme-forest", name: "Forest", icon: "mdi:tree" },
    { id: "theme-aura", name: "Aura", icon: "mdi:shimmer" },
    { id: "theme-marine", name: "Marine", icon: "mdi:water" },
  ];

  let isMenuOpen = false;
  let currentTheme = "theme-midnight";

  onMount(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("portfolio-theme");
      if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.className = currentTheme;
      } else {
        document.documentElement.className = currentTheme;
      }
    }
  });

  function setTheme(themeId: string) {
    currentTheme = themeId;
    if (typeof document !== "undefined") {
      document.documentElement.className = themeId;
      localStorage.setItem("portfolio-theme", themeId);
    }
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  }

  function closeMenu() {
    isMenuOpen = false;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  }

  const isItemActive = (currentPath: string, targetUrl: string) => {
    if (targetUrl === "/") return currentPath === "/";
    return currentPath.startsWith(targetUrl);
  };
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<header class="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-primary/15 text-text shadow-sm transition-all duration-200">
  <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
    
    <!-- Brand / Logo -->
    <a
      href="/"
      class="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-transform active:scale-95"
      aria-label="{title} Home"
    >
      <img src={logoSrc} alt="{title} Logo" class="h-9 w-auto object-contain" />
    </a>

    <!-- Desktop Navigation Links -->
    <nav class="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
      {#each menuItems as item (item.url)}
        {@const active = isItemActive($page.url.pathname, item.url)}
        <a
          href={item.url}
          data-sveltekit-preload-data="hover"
          class="relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary {active
            ? 'text-bg bg-primary shadow-md shadow-primary/25'
            : 'text-muted hover:text-text hover:bg-primary/10'}"
          aria-current={active ? "page" : undefined}
        >
          {item.name}
        </a>
      {/each}
    </nav>

    <!-- Desktop Theme Switcher Pill Group -->
    <div class="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-tertiary/40 border border-primary/20">
      {#each themes as t}
        {@const isSelected = currentTheme === t.id}
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all {isSelected
            ? 'bg-primary text-bg shadow-sm'
            : 'text-muted hover:text-text hover:bg-primary/10'}"
          on:click={() => setTheme(t.id)}
          aria-label="Switch to {t.name} theme"
        >
          <Icon icon={t.icon} class="text-sm" />
          <span>{t.name}</span>
        </button>
      {/each}
    </div>

    <!-- Mobile Hamburger Toggle Button -->
    <button
      type="button"
      class="lg:hidden p-2 rounded-xl text-text hover:bg-primary/10 active:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      on:click={toggleMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMenuOpen}
      aria-controls="mobile-navigation-drawer"
    >
      <Icon icon="mdi:menu" class="text-2xl" />
    </button>
  </div>
</header>

<!-- Mobile Navigation Backdrop Overlay -->
{#if isMenuOpen}
  <button
    type="button"
    class="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40 lg:hidden w-full h-full border-none cursor-default focus:outline-none"
    aria-label="Close mobile navigation overlay"
    tabindex="-1"
    on:click={closeMenu}
  />
{/if}

<!-- Mobile Navigation Slide-Over Drawer -->
<aside
  id="mobile-navigation-drawer"
  class="fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-surface text-text shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden"
  class:translate-x-0={isMenuOpen}
  class:translate-x-full={!isMenuOpen}
  role="dialog"
  aria-modal="true"
  aria-label="Mobile Navigation"
>
  <!-- Drawer Header -->
  <div class="flex items-center justify-between p-5 border-b border-primary/15">
    <div class="flex items-center gap-2">
      <img src={logoSrc} alt="Logo" class="h-7 w-auto object-contain" />
      <span class="text-sm font-bold tracking-tight text-text">Navigation</span>
    </div>
    <button
      type="button"
      class="p-2 rounded-xl text-muted hover:text-text hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      on:click={closeMenu}
      aria-label="Close navigation drawer"
    >
      <Icon icon="mdi:close" class="text-xl" />
    </button>
  </div>

  <!-- Drawer Menu Links -->
  <nav class="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile Menu Links">
    <ul class="space-y-2">
      {#each menuItems as item (item.url)}
        {@const active = isItemActive($page.url.pathname, item.url)}
        <li>
          <a
            href={item.url}
            data-sveltekit-preload-data="hover"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all {active
              ? 'bg-primary text-bg shadow-md shadow-primary/30 border border-primary/40'
              : 'bg-tertiary/40 text-text hover:bg-primary/10 border border-primary/5'}"
            aria-current={active ? "page" : undefined}
            on:click={closeMenu}
          >
            <span>{item.name}</span>
            <Icon icon="mdi:chevron-right" class="text-base {active ? 'text-bg' : 'text-muted'}" />
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Mobile Theme Selector Section -->
  <div class="p-4 border-t border-primary/15 space-y-2">
    <p class="text-xs uppercase tracking-wider font-bold text-muted px-2">Select Theme</p>
    <div class="grid grid-cols-2 gap-2">
      {#each themes as t}
        {@const isSelected = currentTheme === t.id}
        <button
          type="button"
          class="flex items-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all {isSelected
            ? 'bg-primary text-bg shadow-md'
            : 'bg-tertiary/40 text-text hover:bg-primary/15'}"
          on:click={() => setTheme(t.id)}
        >
          <Icon icon={t.icon} class="text-base" />
          <span class="capitalize">{t.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Drawer Footer Info -->
  <div class="p-4 border-t border-primary/15 text-center text-2xs text-muted font-mono">
    &copy; {new Date().getFullYear()} {title}
  </div>
</aside>