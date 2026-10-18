/**
 * The café interior, rebuilt entirely in CSS — no screenshot is used as a
 * background. Layers run back to front:
 *
 *   wall wash -> arched window (right) -> slatted nook + pendant lamp (left)
 *   -> cream sign panel behind the headline -> neon guide lines
 *   -> counter front with its glow strip -> out-of-focus produce (corners)
 *
 * The produce in the corners is the only part that sits above the content,
 * which is what gives the reference its shallow depth of field.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Warm cream wall, lit from the upper right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 95% at 72% 14%, #fffdf9 0%, #fdf4e8 34%, #f8e6d0 64%, #f2d6b6 100%)",
        }}
      />

      {/* ---- arched window, far right ---- */}
      <div className="absolute top-[3%] right-[-7%] hidden h-[84%] w-[25%] md:block">
        {/* Outer frame, then a deeper inner ring, then the reveal. */}
        <div
          className="absolute inset-0 rounded-t-full"
          style={{ background: "linear-gradient(170deg, #fbbd7d 0%, #f49a4a 45%, #e8861f 100%)" }}
        />
        <div
          className="absolute inset-[4%] bottom-0 rounded-t-full"
          style={{ background: "linear-gradient(170deg, #f59229 0%, #ea7d1b 55%, #d96b12 100%)" }}
        />
        <div
          className="absolute inset-[11%] bottom-0 rounded-t-full"
          style={{ background: "linear-gradient(170deg, #fff4e6 0%, #fae3c8 100%)" }}
        />
        {/* Glass: blown-out daylight with palm silhouettes. */}
        <div
          className="absolute inset-[15%] bottom-0 overflow-hidden rounded-t-full"
          style={{
            background:
              "linear-gradient(165deg, #f2f7e8 0%, #d7e8bc 26%, #a6cb7c 58%, #cfe3b2 82%, #eef5e4 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(34% 26% at 28% 22%, rgba(86,124,48,0.8) 0%, transparent 72%)," +
                "radial-gradient(30% 40% at 70% 48%, rgba(70,106,40,0.7) 0%, transparent 72%)," +
                "radial-gradient(26% 22% at 42% 74%, rgba(112,152,70,0.65) 0%, transparent 74%)," +
                "radial-gradient(40% 30% at 86% 86%, rgba(255,255,255,0.75) 0%, transparent 70%)",
              filter: "blur(9px)",
            }}
          />
        </div>
      </div>

      {/* ---- left nook: slatted timber inside a soft arch ---- */}
      <div className="absolute top-[30%] left-[-9%] hidden h-[44%] w-[13%] md:block">
        <div
          className="absolute inset-0 rounded-tr-[9rem] rounded-br-[9rem]"
          style={{ background: "linear-gradient(90deg, #f7b877 0%, #f0a45c 70%, #e89445 100%)" }}
        />
        <div
          className="absolute inset-[7%] rounded-tr-[8rem] rounded-br-[8rem]"
          style={{
            background: "repeating-linear-gradient(90deg, #d98f4a 0px, #f3c492 6px, #d98f4a 12px)",
            filter: "blur(1.2px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-tr-[9rem] rounded-br-[9rem]"
          style={{ background: "linear-gradient(90deg, rgba(253,244,233,0.55) 0%, transparent 55%)" }}
        />
      </div>

      {/* ---- pendant lamp, hanging from behind the navbar ---- */}
      <div className="absolute top-0 left-[3.5%] hidden w-[108px] md:block">
        <div className="mx-auto h-[110px] w-[2px] bg-[#c98b4e]" />
        {/* Dome shade. */}
        <div
          className="h-[52px] w-[108px]"
          style={{
            background: "linear-gradient(175deg, #ef9a51 0%, #e07c2c 60%, #c96420 100%)",
            borderRadius: "54px 54px 10px 10px / 46px 46px 6px 6px",
          }}
        />
        {/* Bulb and the cone of light it throws. */}
        <div className="mx-auto -mt-[7px] h-[14px] w-[30px] rounded-full bg-[#fff2c9]" style={{ filter: "blur(3px)" }} />
        <div
          className="mx-auto -mt-[10px] h-[120px] w-[190px]"
          style={{
            background: "radial-gradient(50% 44% at 50% 0%, rgba(255,205,130,0.8) 0%, transparent 74%)",
            filter: "blur(14px)",
          }}
        />
      </div>

      {/* ---- cream sign panel behind the headline ---- */}
      <div className="absolute top-[12%] left-[7%] hidden h-[44%] w-[43%] lg:block">
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "46% 54% 40% 60% / 56% 44% 56% 44%",
            background: "linear-gradient(160deg, #fffdf8 0%, #fdf3e5 48%, #f9e8d4 100%)",
            boxShadow: "0 0 0 2px rgba(255,236,206,0.9), 0 40px 90px -50px rgba(140,88,30,0.55)",
          }}
        />
        {/* Thin lit rim along the top edge, as in the reference. */}
        <div
          className="absolute inset-[-3px]"
          style={{
            borderRadius: "46% 54% 40% 60% / 56% 44% 56% 44%",
            background: "linear-gradient(160deg, rgba(255,226,180,0.95) 0%, transparent 42%)",
            filter: "blur(4px)",
          }}
        />
        <div
          className="absolute inset-[6px]"
          style={{
            borderRadius: "46% 54% 40% 60% / 56% 44% 56% 44%",
            background: "linear-gradient(160deg, #fffdf8 0%, #fdf4e7 55%, #faeada 100%)",
          }}
        />
      </div>

      {/* Neon guide lines tracing the back wall. */}
      <div
        className="absolute top-[13%] right-[26%] hidden h-[30%] w-[24%] rounded-[46%] border-2 border-[#ffd9a8]/70 lg:block"
        style={{ filter: "blur(3px)" }}
      />

      {/* ---- counter front crossing the bottom ---- */}
      <div
        className="absolute bottom-[-34%] left-[-12%] h-[62%] w-[130%] rounded-[50%]"
        style={{ background: "linear-gradient(180deg, #fffaf2 0%, #f9e8d2 55%, #f2d5b2 100%)" }}
      />
      {/* Glow strip and vertical slats along the counter front, lower left. */}
      <div
        className="absolute bottom-[6%] left-[-4%] hidden h-[13%] w-[46%] -rotate-[4deg] md:block"
        style={{
          background: "repeating-linear-gradient(90deg, #f0b45f 0px, #ffe4ac 7px, #f0b45f 14px)",
          filter: "blur(3px)",
          opacity: 0.85,
          maskImage: "linear-gradient(90deg, #000 0%, #000 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-[19%] left-[-4%] hidden h-[4px] w-[44%] -rotate-[4deg] rounded-full md:block"
        style={{ background: "#ffdfa6", filter: "blur(4px)" }}
      />
      {/* The orange counter ribbon itself. */}
      <div
        className="absolute bottom-[-28%] left-[14%] h-[48%] w-[112%] rounded-[50%]"
        style={{
          background: "linear-gradient(180deg, #fcb265 0%, #f28c2a 46%, #e2741a 100%)",
          boxShadow: "0 -20px 50px rgba(242,138,40,0.45)",
        }}
      />

      {/* ---- out-of-focus produce in the near corners ---- */}
      <div
        className="absolute bottom-[-12%] left-[-8%] z-40 hidden h-[50%] w-[22%] md:block"
        style={{
          background:
            "radial-gradient(26% 20% at 42% 12%, #3f7a28 0%, #2d5c1b 62%, transparent 76%)," +
            "radial-gradient(30% 22% at 16% 34%, #4e8f31 0%, #356622 60%, transparent 78%)," +
            "radial-gradient(24% 26% at 52% 46%, #58a038 0%, #3a7224 60%, transparent 78%)," +
            "radial-gradient(30% 24% at 34% 74%, #c7382a 0%, #9c2419 58%, transparent 76%)",
          filter: "blur(26px)",
          opacity: 0.92,
        }}
      />
      <div
        className="absolute right-[-5%] bottom-[-14%] z-40 hidden h-[40%] w-[18%] md:block"
        style={{
          background:
            "radial-gradient(30% 26% at 58% 26%, #d8402c 0%, #a9281a 58%, transparent 74%)," +
            "radial-gradient(28% 24% at 26% 62%, #4f8c33 0%, #336020 60%, transparent 78%)," +
            "radial-gradient(24% 22% at 72% 82%, #5f9b3c 0%, transparent 74%)",
          filter: "blur(24px)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}
