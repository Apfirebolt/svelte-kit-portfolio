<script lang="ts">
  import Icon from "@iconify/svelte";
  let menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Gallery", url: "/gallery" },
  ];
  export let title: string = "Svelte Kit Portfolio";
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<header class="bg-primary text-light">
  <div class="container mx-auto flex items-center justify-between px-6 py-4">
    <h1 class="text-3xl font-bold">{title}</h1>
    <button
      class="lg:hidden text-white focus:outline-none"
      on:click={toggleMenu}
      aria-label="Toggle menu"
    >
      <Icon icon="mdi:menu" class="text-3xl" />
    </button>
    <nav class="hidden lg:block">
      <ul class="flex space-x-6">
        {#each menuItems as item}
          <li class="relative group">
			<a
			  href={item.url}
			  data-sveltekit-prefetch
			  class="text-white px-4 py-3 rounded transition-all duration-300 ease-in-out group-hover:rounded-lg group-hover:border group-hover:shadow-2xl"
			>
			  {item.name}
			</a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>

  <!-- Mobile Menu -->
  <div
    class="fixed top-0 right-0 bg-secondary text-accent z-40 h-full w-1/2 transform transition-transform duration-300 ease-in-out"
    class:translate-x-0={isMenuOpen}
    class:translate-x-full={!isMenuOpen}
  >
    <div class="flex justify-end p-4">
      <button
        class="text-white focus:outline-none"
        on:click={toggleMenu}
        aria-label="Close menu"
      >
        <Icon icon="mdi:close" class="text-3xl" />
      </button>
    </div>
    <ul class="space-y-4 px-6">
      {#each menuItems as item}
        <li
          class="bg-bermuda text-white px-2 py-3 text-center shadow-xl rounded hover:bg-tertiary hover:text-secondary transition-colors duration-300"
        >
          <a href={item.url} data-sveltekit-prefetch on:click={toggleMenu}>
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</header>

<style>
  .translate-x-0 {
    transform: translateX(0);
  }
  .translate-x-full {
    transform: translateX(100%);
  }
</style>
