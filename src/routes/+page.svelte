<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";

  const headline = "Welcome to My Portfolio";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 75);
      }
    };
    tick();
  };

  const featureCards = [
    {
      title: "Browse Projects",
      description: "Some projects I worked on.",
      url: "/projects",
      icon: "mdi:code-braces",
      delay: 0,
    },
    {
      title: "Browse Gallery",
      description: "Some pictures from my life.",
      url: "/gallery",
      icon: "mdi:image-multiple-outline",
      delay: 150,
    },
    {
      title: "My Blog",
      description: "View and react to my blog posts.",
      url: "/blog",
      icon: "mdi:post-outline",
      delay: 300,
    },
  ];

  onMount(() => {
    runTypewriter();
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>Home - Amit Prafulla Portfolio</title>
  <meta
    name="description"
    content="Know me better through my work and life. Explore projects, gallery pictures, and blog reflections."
  />
</svelte:head>

<div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-bg">
  <HeaderComponent title="My Portfolio" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[500px] flex items-center justify-center overflow-hidden border-b border-primary/20"
    style="background-image: url('https://hips.hearstapps.com/hmg-prod/images/hawa-mahal-jaipur-india-1594738893.jpg');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/60 to-bg/95 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 text-text space-y-6">
      <h1
        class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight min-h-[3rem] sm:min-h-[4rem] text-primary"
        in:fly={{ y: 30, duration: 450 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-base sm:text-lg lg:text-xl text-text opacity-90 leading-relaxed max-w-3xl mx-auto"
        in:fly={{ y: 30, duration: 450, delay: 150 }}
      >
        Know me better through my work and life. My portfolio showcases my
        skills and experiences, while my gallery offers a glimpse into my
        personal moments. Explore my blog for insights and reflections on
        various topics. Let's connect and create something amazing together!
      </p>
    </div>
  </section>

  <!-- Interactive Exploration Cards -->
  <section class="py-16 bg-gradient-to-b from-surface via-bg to-surface flex-1">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-text mb-12 tracking-tight"
        in:fly={{ y: 30, duration: 400 }}
      >
        Explore My Personal Portfolio
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {#each featureCards as card (card.url)}
          <a
            href={card.url}
            data-sveltekit-preload-data="hover"
            class="group p-8 bg-surface text-text rounded-3xl shadow-xl hover:shadow-2xl border border-primary/20 transition-all duration-300 flex flex-col justify-between items-center text-center transform hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-md"
            in:fly={{ y: 30, duration: 450, delay: card.delay }}
          >
            <div class="w-14 h-14 rounded-2xl bg-primary/15 text-primary group-hover:bg-primary group-hover:text-bg flex items-center justify-center mb-6 shadow-inner transition-colors duration-300">
              <Icon icon={card.icon} class="text-3xl" />
            </div>

            <div class="space-y-2 flex-1">
              <h3 class="text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p class="text-sm text-muted leading-relaxed">
                {card.description}
              </p>
            </div>

            <div class="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:opacity-80 transition-opacity">
              <span>Explore</span>
              <Icon icon="mdi:arrow-right" class="text-base group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <FooterComponent />
</div>