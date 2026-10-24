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

  let formData = { name: "", email: "", message: "" };
  let status = { loading: false, success: false, error: "" };

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    status = { loading: true, success: false, error: "" };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      status = { loading: false, success: true, error: "" };
      formData = { name: "", email: "", message: "" };

      setTimeout(() => {
        status.success = false;
      }, 5000);
    } catch (err: any) {
      status = { loading: false, success: false, error: err.message || "Something went wrong." };
    }
  }
</script>

<footer class="w-full border-t border-primary/25 bg-surface text-text transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      <!-- Left Column: Brand, Bio & Socials -->
      <div class="lg:col-span-4 space-y-6">
        <div>
          <a href="/" class="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <span class="text-2xl font-black tracking-tight text-text">
              APG<span class="text-accent">IIIT</span>
            </span>
          </a>
          <p class="text-sm leading-relaxed text-muted mt-3 max-w-sm">
            Engineering web experiences, exploring scalable architectures, and sharing technical insights.
          </p>
        </div>

        <!-- Availability Status -->
        <div class="flex items-center gap-2">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          <span class="text-xs font-medium text-text opacity-90">Available for collaborations</span>
        </div>

        <!-- Quick Links -->
        <div class="space-y-3 pt-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Navigation</h3>
          <ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {#each menuItems as item (item.url)}
              <li>
                <a
                  href={item.url}
                  data-sveltekit-preload-data="hover"
                  class="inline-block transition-colors duration-200 text-muted hover:text-primary font-medium"
                >
                  {item.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Social Icons -->
        <div class="space-y-3 pt-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Connect</h3>
          <div class="flex items-center gap-3">
            {#each socialLinks as social (social.name)}
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                class="p-2.5 rounded-xl bg-tertiary/40 border border-primary/20 text-text hover:text-primary hover:border-primary/50 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Icon icon={social.icon} class="text-lg" />
              </a>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Column: Contact Form -->
      <div class="lg:col-span-8 bg-tertiary/30 border border-primary/20 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-lg">
        <div class="space-y-2 mb-6">
          <h3 class="text-lg font-bold text-text">Get in Touch</h3>
          <p class="text-sm text-muted">
            Have a project in mind, a question, or want to collaborate? Drop a message below.
          </p>
        </div>

        <form on:submit={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label for="footer-name" class="block text-xs font-semibold text-text opacity-90">
                Your Name
              </label>
              <input
                id="footer-name"
                type="text"
                bind:value={formData.name}
                required
                placeholder="John Doe"
                class="w-full px-4 py-2.5 rounded-xl text-sm bg-bg border border-primary/30 text-text placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors shadow-xs"
              />
            </div>
            <div class="space-y-1.5">
              <label for="footer-email" class="block text-xs font-semibold text-text opacity-90">
                Your Email
              </label>
              <input
                id="footer-email"
                type="email"
                bind:value={formData.email}
                required
                placeholder="john@example.com"
                class="w-full px-4 py-2.5 rounded-xl text-sm bg-bg border border-primary/30 text-text placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors shadow-xs"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="footer-message" class="block text-xs font-semibold text-text opacity-90">
              Your Message
            </label>
            <textarea
              id="footer-message"
              bind:value={formData.message}
              rows={4}
              required
              placeholder="Tell me about your project or inquiry..."
              class="w-full px-4 py-2.5 rounded-xl text-sm bg-bg border border-primary/30 text-text placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none shadow-xs"
            ></textarea>
          </div>

          <!-- Status Banners -->
          {#if status.success}
            <div class="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium">
              <Icon icon="mdi:check-circle" class="text-base shrink-0" />
              <span>Thank you! Your message has been sent successfully.</span>
            </div>
          {/if}

          {#if status.error}
            <div class="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
              <Icon icon="mdi:alert-circle" class="text-base shrink-0" />
              <span>{status.error}</span>
            </div>
          {/if}

          <button
            type="submit"
            disabled={status.loading}
            class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-bg hover:opacity-90 transition-all shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? "Sending Message..." : "Send Message"}
          </button>
        </form>
      </div>

    </div>

    <!-- Bottom Copyright & Back-to-Top Row -->
    <div class="mt-12 pt-6 border-t border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono text-center sm:text-left">
      <p>
        &copy; {year} Amit Prafulla. All rights reserved.
      </p>
      <div class="flex items-center gap-6">
        <span>Built with SvelteKit & Tailwind CSS</span>
        <a
          href="#top"
          class="hover:text-primary transition-colors underline underline-offset-2"
        >
          Back to top &uarr;
        </a>
      </div>
    </div>
  </div>
</footer>