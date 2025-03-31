<script>
  import { fly } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";

  let text = "Welcome to My Portfolio";
  let displayedText = "";
  let index = 0;

  // Typewriter effect logic
  const typeWriter = () => {
    if (index < text.length) {
      displayedText += text[index];
      index++;
      setTimeout(typeWriter, 100); // Adjust speed here
    }
  };

  // Start the typewriter effect when the component is mounted
  typeWriter();
</script>

<HeaderComponent title="My Portfolio" />

<section
  class="relative bg-cover bg-center h-[500px]"
  style="background-image: url('https://hips.hearstapps.com/hmg-prod/images/hawa-mahal-jaipur-india-1594738893.jpg');"
>
  <div
    class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="text-center text-light">
      <h1
        class="text-4xl md:text-6xl font-bold mb-4"
        in:fly={{ y: 50, duration: 500 }}
      >
        {displayedText}
      </h1>
      <p
        class="text-lg md:text-xl mb-6"
        in:fly={{ y: 50, duration: 500, delay: 200 }}
      >
        Know me better through my work and life. My portfolio showcases my
        skills and experiences, while my gallery offers a glimpse into my
        personal moments. Explore my blog for insights and reflections on
        various topics. Let's connect and create something amazing together!
      </p>
    </div>
  </div>
</section>

<section class="py-12 bg-gray-100">
  <div class="container mx-auto px-6">
    <h2
      class="text-3xl font-bold text-center mb-8"
      in:fly={{ y: 50, duration: 500 }}
    >
      Explore Our Features
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        class="text-center p-6 bg-white shadow-lg rounded-lg"
        in:fly={{ y: 50, duration: 500 }}
      >
        <h3 class="text-xl font-semibold mb-4">Browse Projects</h3>
        <p>Some projects I worked on.</p>
      </div>
      <div
        class="text-center p-6 bg-white shadow-lg rounded-lg"
        in:fly={{ y: 50, duration: 500, delay: 200 }}
      >
        <h3 class="text-xl font-semibold mb-4">Browser Gallery</h3>
        <p>Some pictures from my life.</p>
      </div>
      <div
        class="text-center p-6 bg-white shadow-lg rounded-lg"
        in:fly={{ y: 50, duration: 500, delay: 400 }}
      >
        <h3 class="text-xl font-semibold mb-4">My Blog</h3>
        <p>View and react to my blog posts</p>
      </div>
    </div>
  </div>
</section>

<FooterComponent />
