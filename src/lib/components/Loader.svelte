<script lang="ts">
  import { fade } from "svelte/transition";

  export let text: string = "Loading resources";
  export let subtext: string = "Please wait a moment";
  export let fullScreen: boolean = true;
</script>

<div
  class="loader-overlay {fullScreen ? 'fixed inset-0 min-h-screen' : 'w-full py-16'}"
  role="status"
  aria-live="polite"
  aria-busy="true"
  out:fade={{ duration: 250 }}
>
  <!-- Ambient backdrop lighting -->
  <div class="glow-orb" />

  <div class="loader-card">
    <!-- Concentric Dual-Ring Spinner Assembly -->
    <div class="spinner-stage">
      <!-- Outer Track -->
      <div class="spinner-track" />
      <!-- Primary Counter Spinner -->
      <div class="spinner-core" />
      <!-- Inner Pulse Center -->
      <div class="spinner-pulse" />
    </div>

    <!-- Typography / Loading Status -->
    <div class="status-content">
      <div class="status-header">
        <span class="status-text">{text}</span>
        <span class="dots-flurry">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
      {#if subtext}
        <p class="status-subtext">{subtext}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .loader-overlay {
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 50% 40%, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.92) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    overflow: hidden;
  }

  .glow-orb {
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0) 70%);
    filter: blur(40px);
    pointer-events: none;
    animation: pulse-glow 3s ease-in-out infinite alternate;
  }

  .loader-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2rem 2.5rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Spinner Assembly */
  .spinner-stage {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-track {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.08);
  }

  .spinner-core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #6366f1;
    border-right-color: #8b5cf6;
    animation: spin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
  }

  .spinner-pulse {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #6366f1;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.8);
    animation: core-pulse 1.4s ease-in-out infinite alternate;
  }

  /* Status text */
  .status-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-align: center;
  }

  .status-header {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .status-text {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #f8fafc;
    font-family: inherit;
  }

  .status-subtext {
    font-size: 0.75rem;
    color: #94a3b8;
    margin: 0;
    font-family: monospace;
  }

  /* Micro animation dots */
  .dots-flurry {
    display: inline-flex;
    gap: 2.5px;
    align-items: center;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: #6366f1;
    animation: dot-wave 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes core-pulse {
    0% {
      transform: scale(0.75);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.15);
      opacity: 1;
    }
  }

  @keyframes pulse-glow {
    0% {
      transform: scale(0.9);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.1);
      opacity: 0.6;
    }
  }

  @keyframes dot-wave {
    0%, 80%, 100% {
      transform: scale(0.5);
      opacity: 0.3;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
</style>