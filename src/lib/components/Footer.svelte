<script lang="ts">
  import Icon from "@iconify/svelte";

  export let year: number = new Date().getFullYear();

  const menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Projects", url: "/projects" },
    { name: "Blog", url: "/blog" },
    { name: "Gallery", url: "/gallery" },
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com", icon: "mdi:github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "mdi:linkedin" },
    { name: "Email", url: "mailto:contact@softgenie.org", icon: "mdi:email-outline" },
  ];
</script>

<footer class="bg-primary text-light border-t border-secondary/20 transition-colors">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-light/10">
      
      <!-- Brand & Headline -->
      <div class="text-center md:text-left space-y-1">
        <p class="text-xs text-light/70 font-mono">
          Full-Stack Portfolio
        </p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex flex-wrap justify-center gap-1 sm:gap-2" aria-label="Footer Navigation">
        {#each menuItems as item (item.url)}
          <a
            href={item.url}
            data-sveltekit-preload-data="hover"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-light/80 hover:text-light hover:bg-secondary/40 active:bg-secondary/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-light"
          >
            {item.name}
          </a>
        {/each}
      </nav>

      <!-- Social Links -->
      <div class="flex items-center gap-2">
        {#each socialLinks as social (social.name)}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg bg-dark/40 hover:bg-dark text-light/80 hover:text-light border border-light/10 hover:border-light/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-light"
            aria-label={social.name}
          >
            <Icon icon={social.icon} class="text-lg" />
          </a>
        {/each}
      </div>
    </div>

    <!-- Bottom Copyright & Back-to-Top Row -->
    <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-light/60 font-mono text-center sm:text-left">
      <p>
        &copy; {year} Amit Prafulla. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <span>Built with SvelteKit & Tailwind CSS</span>
        <a
          href="#top"
          class="hover:text-light transition-colors underline underline-offset-2"
        >
          Back to top &uarr;
        </a>
      </div>
    </div>
  </div>
</footer>