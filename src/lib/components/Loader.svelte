<script lang="ts">
  
</script>

<div class="loader-container">
  <div class="cube">
  <div class="face front"></div>
  <div class="face back"></div>
  <div class="face left"></div>
  <div class="face right"></div>
  <div class="face top"></div>
  <div class="face bottom"></div>
  </div>
  <div class="loading-text">Loading...</div>
</div>
<style>
  .loader-container {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #56021F, #015551, #B4EBE6, #a18cd1);
  background-size: 400% 400%;
  animation: gradient-shift 6s infinite;
  z-index: 50;
  }

  .cube {
  position: relative;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  animation: rotate 5s infinite linear;
  }

  .face {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  }

  .front {
  transform: translateZ(50px);
  }

  .back {
  transform: rotateY(180deg) translateZ(50px);
  }

  .left {
  transform: rotateY(-90deg) translateZ(50px);
  }

  .right {
  transform: rotateY(90deg) translateZ(50px);
  }

  .top {
  transform: rotateX(90deg) translateZ(50px);
  }

  .bottom {
  transform: rotateX(-90deg) translateZ(50px);
  }

  .loading-text {
  margin-top: 20px;
  font-size: 1.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  font-weight: bold;
  }

  @keyframes rotate {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
  }

  @keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  }
</style>
