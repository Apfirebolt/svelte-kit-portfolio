<script lang="ts">
  export let year: number = new Date().getFullYear();
  let menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Gallery", url: "/gallery" },
  ];
</script>

<footer class="bg-primary text-white py-6 border-t border-gray-700">
  <div class="container mx-auto text-center space-y-4">
    <nav class="flex justify-center space-x-6">
      {#each menuItems as item}
        <a 
          href={item.url} 
          class="text-sm hover:text-lg mx-6 hover:shadow-lg hover:no-underline transition-all duration-200">
          {item.name}
        </a>
      {/each}
    </nav>
    <p class="text-sm">
      &copy; {year} Sveltekit Movies. All rights reserved.
    </p>
  </div>
</footer>
