'use client'

// Static CSS gradient background — visually equivalent to the previous
// canvas version, but with zero per-frame JS work (huge perf win).
export default function GradientMesh() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(450px circle at 15% 25%, rgba(0, 102, 204, 0.06), transparent 70%),
          radial-gradient(400px circle at 85% 15%, rgba(0, 163, 255, 0.05), transparent 70%),
          radial-gradient(350px circle at 50% 65%, rgba(0, 61, 128, 0.04), transparent 70%),
          radial-gradient(300px circle at 90% 75%, rgba(0, 102, 204, 0.04), transparent 70%),
          radial-gradient(280px circle at 10% 85%, rgba(0, 163, 255, 0.03), transparent 70%),
          radial-gradient(circle at 50% 50%, transparent 40%, rgba(240, 248, 255, 0.3) 100%)
        `,
      }}
    />
  )
}
