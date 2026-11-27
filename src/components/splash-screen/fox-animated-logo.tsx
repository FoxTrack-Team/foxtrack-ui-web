"use client";

import { memo } from "react";

function FoxAnimatedLogoBase() {
  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      {/* Dual-Tone Studio Ambient Gradient (zero blur filter for 120fps compositing) */}
      <div
        aria-hidden="true"
        className="splash-aura pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_45%_42%,rgba(249,115,22,0.16)_0%,rgba(47,224,168,0.07)_44%,transparent_70%)] dark:bg-[radial-gradient(circle_at_45%_42%,rgba(249,115,22,0.22)_0%,rgba(47,224,168,0.10)_46%,transparent_72%)]"
      />

      {/* Completion Ripple Wave (CSS GPU transform + opacity only) */}
      <div
        aria-hidden="true"
        className="splash-ripple pointer-events-none absolute h-24 w-24 rounded-full border border-teal-400/55 dark:border-teal-300/45"
      />

      {/* Precision Outer Guide & Sweeping Orbital Ring */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-36 w-36"
        viewBox="0 0 128 128"
      >
        <defs>
          <linearGradient id="splash-orbit-grad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#fc6716" />
            <stop offset="58%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#2fe0a8" />
          </linearGradient>
        </defs>

        <circle
          className="splash-guide-ring text-neutral-300 dark:text-neutral-700"
          cx="64"
          cy="64"
          fill="none"
          r="61"
          stroke="currentColor"
          strokeDasharray="2.5 5.5"
          strokeLinecap="round"
          strokeWidth="1"
        />

        <circle
          className="text-neutral-200/70 dark:text-neutral-800/80"
          cx="64"
          cy="64"
          fill="none"
          r="55"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <circle
          className="splash-orbit-ring"
          cx="64"
          cy="64"
          fill="none"
          r="55"
          stroke="url(#splash-orbit-grad)"
          strokeDasharray="245 346"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>

      {/* Circular Ceramic Medallion (clean shadow-sm so scale never blurs/repaints tiles) */}
      <div className="splash-medallion relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
        {/* Single GPU-Promoted Layer Wrapping Both Cached Body SVG & Lightweight Stroke Overlay */}
        <div className="splash-fox-layer relative h-14 w-14">
          {/* Cached Clipped Fox Vector (Rasterized Once onto GPU Texture) */}
          <svg
            aria-label="FoxTrack Logo"
            className="h-14 w-14 select-none"
            role="img"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gSil"
                x1="764.2"
                x2="383.1"
                y1="469.7"
                y2="875.5"
              >
                <stop offset="0.056" stopColor="#fc6716" />
                <stop offset="0.167" stopColor="#fc6015" />
                <stop offset="0.278" stopColor="#fc5c14" />
                <stop offset="0.389" stopColor="#fc5f14" />
                <stop offset="0.500" stopColor="#fc6215" />
                <stop offset="0.611" stopColor="#fa5814" />
                <stop offset="0.722" stopColor="#f54811" />
                <stop offset="0.833" stopColor="#f24010" />
                <stop offset="0.944" stopColor="#ee380f" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gA"
                x1="774.0"
                x2="297.6"
                y1="478.6"
                y2="462.4"
              >
                <stop offset="0.056" stopColor="#fc6f19" />
                <stop offset="0.167" stopColor="#fc6d18" />
                <stop offset="0.278" stopColor="#fc6916" />
                <stop offset="0.389" stopColor="#fc6114" />
                <stop offset="0.500" stopColor="#fc5b13" />
                <stop offset="0.611" stopColor="#fb5612" />
                <stop offset="0.722" stopColor="#f64d11" />
                <stop offset="0.833" stopColor="#ed4111" />
                <stop offset="0.944" stopColor="#e43410" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gB"
                x1="578.8"
                x2="366.8"
                y1="637.8"
                y2="865.3"
              >
                <stop offset="0.056" stopColor="#fd751a" />
                <stop offset="0.167" stopColor="#fd751a" />
                <stop offset="0.278" stopColor="#fd751b" />
                <stop offset="0.389" stopColor="#fd6e19" />
                <stop offset="0.500" stopColor="#fc6115" />
                <stop offset="0.611" stopColor="#fa5412" />
                <stop offset="0.722" stopColor="#f64810" />
                <stop offset="0.833" stopColor="#f03d0f" />
                <stop offset="0.944" stopColor="#ec350f" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gC"
                x1="749.0"
                x2="674.9"
                y1="730.7"
                y2="982.5"
              >
                <stop offset="0.056" stopColor="#fc781a" />
                <stop offset="0.167" stopColor="#fc7218" />
                <stop offset="0.278" stopColor="#fc6917" />
                <stop offset="0.389" stopColor="#fb5d14" />
                <stop offset="0.500" stopColor="#f84f12" />
                <stop offset="0.611" stopColor="#f14211" />
                <stop offset="0.722" stopColor="#e73611" />
                <stop offset="0.833" stopColor="#db2b11" />
                <stop offset="0.944" stopColor="#d32412" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gF"
                x1="571.0"
                x2="622.3"
                y1="471.7"
                y2="665.1"
              >
                <stop offset="0.056" stopColor="#fcead2" />
                <stop offset="0.167" stopColor="#fce8cf" />
                <stop offset="0.278" stopColor="#fce4ca" />
                <stop offset="0.389" stopColor="#fce0c3" />
                <stop offset="0.500" stopColor="#fcdaba" />
                <stop offset="0.611" stopColor="#fbd5b1" />
                <stop offset="0.722" stopColor="#fcd1a9" />
                <stop offset="0.833" stopColor="#fccba1" />
                <stop offset="0.944" stopColor="#fcc69a" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gT"
                x1="951.0"
                x2="912.4"
                y1="890.2"
                y2="599.1"
              >
                <stop offset="0.056" stopColor="#fcc69f" />
                <stop offset="0.167" stopColor="#fccea8" />
                <stop offset="0.278" stopColor="#fbd5b2" />
                <stop offset="0.389" stopColor="#fbdbbb" />
                <stop offset="0.500" stopColor="#fbdfc2" />
                <stop offset="0.611" stopColor="#fbe2c7" />
                <stop offset="0.722" stopColor="#fbe5cd" />
                <stop offset="0.833" stopColor="#fae7d0" />
                <stop offset="0.944" stopColor="#fbe8d2" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gE"
                x1="549.1"
                x2="456.9"
                y1="374.7"
                y2="302.5"
              >
                <stop offset="0.056" stopColor="#fcd4a7" />
                <stop offset="0.167" stopColor="#fcd5a9" />
                <stop offset="0.278" stopColor="#fcd8ae" />
                <stop offset="0.389" stopColor="#fcdbb2" />
                <stop offset="0.500" stopColor="#fcdcb5" />
                <stop offset="0.611" stopColor="#fcdeb9" />
                <stop offset="0.722" stopColor="#fce0bd" />
                <stop offset="0.833" stopColor="#fce2c0" />
                <stop offset="0.944" stopColor="#fce3c1" />
              </linearGradient>
              <clipPath id="splash-silhouette">
                <path d="M838.9 502.2 C831.7 533.2 788.6 548.1 761.5 556.9 C694.7 578.6 604.8 563.8 560.9 630.5 C550.4 646.3 544.3 663.8 544.0 682.8 C542.8 773.2 656.1 821.8 734.1 802.8 C814.8 783.2 899.9 725.2 931.7 646.4 C941.6 621.8 942.0 597.2 944.6 571.3 C958.4 590.0 965.8 611.5 972.0 633.7 C998.8 730.3 970.6 839.6 894.5 906.3 C782.2 1004.6 618.5 1039.7 483.5 967.2 C337.5 888.8 239.9 715.9 302.0 552.3 C314.9 518.3 333.0 487.6 357.3 460.5 C367.3 449.4 395.8 427.6 401.1 416.8 C407.0 404.6 404.4 379.6 406.6 365.2 C411.7 331.6 420.5 298.6 434.1 267.4 C440.4 253.1 449.4 227.9 466.7 224.0 C483.6 220.3 503.6 231.8 517.8 239.7 C552.8 259.2 581.7 286.6 603.4 320.2 C609.2 329.2 613.3 339.9 620.1 348.2 C624.1 353.0 671.7 371.4 688.8 385.4 C716.7 408.4 727.5 445.6 755.1 468.4 C782.5 491.2 809.1 489.0 838.9 502.2 Z" />
              </clipPath>
            </defs>

            <g transform="translate(32.00 32.00) scale(0.0765) translate(-632.0 -614.5)">
              <g clipPath="url(#splash-silhouette)">
                <path
                  d="M838.9 502.2 C831.7 533.2 788.6 548.1 761.5 556.9 C694.7 578.6 604.8 563.8 560.9 630.5 C550.4 646.3 544.3 663.8 544.0 682.8 C542.8 773.2 656.1 821.8 734.1 802.8 C814.8 783.2 899.9 725.2 931.7 646.4 C941.6 621.8 942.0 597.2 944.6 571.3 C958.4 590.0 965.8 611.5 972.0 633.7 C998.8 730.3 970.6 839.6 894.5 906.3 C782.2 1004.6 618.5 1039.7 483.5 967.2 C337.5 888.8 239.9 715.9 302.0 552.3 C314.9 518.3 333.0 487.6 357.3 460.5 C367.3 449.4 395.8 427.6 401.1 416.8 C407.0 404.6 404.4 379.6 406.6 365.2 C411.7 331.6 420.5 298.6 434.1 267.4 C440.4 253.1 449.4 227.9 466.7 224.0 C483.6 220.3 503.6 231.8 517.8 239.7 C552.8 259.2 581.7 286.6 603.4 320.2 C609.2 329.2 613.3 339.9 620.1 348.2 C624.1 353.0 671.7 371.4 688.8 385.4 C716.7 408.4 727.5 445.6 755.1 468.4 C782.5 491.2 809.1 489.0 838.9 502.2 Z"
                  fill="url(#splash-gSil)"
                />
                <path
                  d="M372.0 920.7 C264.7 819.0 221.0 659.4 282.4 521.4 C306.4 467.4 359.9 422.2 369.9 398.2 C385.7 360.5 388.7 226.5 450.8 199.5 C487.2 183.7 530.7 210.6 559.5 231.1 C593.8 255.4 612.2 289.4 640.6 318.8 C660.5 339.3 690.5 347.4 712.0 366.8 C735.7 388.2 748.5 418.1 771.2 440.0 C802.7 470.4 857.5 459.5 867.8 509.6 C846.7 510.5 825.5 508.8 804.4 510.1 C772.1 512.1 743.6 522.4 710.7 516.6 C648.0 505.4 608.0 471.7 538.9 477.6 C441.0 485.9 351.2 603.5 336.7 695.1 C330.0 737.3 336.2 781.4 351.8 821.1 C366.3 857.9 394.0 880.9 372.0 920.7 Z M449.8 409.3 C470.3 397.9 490.3 386.0 512.8 379.2 C524.4 375.7 536.8 374.1 548.0 369.5 C551.9 367.8 555.9 365.5 558.3 361.9 C572.6 340.0 516.0 269.0 491.7 269.0 C450.7 269.0 447.4 381.5 449.8 409.3 Z"
                  fill="url(#splash-gA)"
                />
                <path
                  d="M721.4 776.0 C716.5 818.1 688.3 808.0 656.1 807.6 C587.9 806.9 539.1 775.1 494.4 726.2 C469.6 835.8 529.0 929.0 629.4 973.2 C645.6 980.3 662.2 987.4 679.6 990.9 C708.5 996.8 730.9 992.1 747.8 1020.2 C640.8 1049.7 528.5 1036.1 435.8 973.1 C418.7 961.5 396.9 948.3 385.3 930.7 C374.5 914.5 384.7 893.0 377.2 874.9 C364.8 845.2 348.4 819.2 340.9 787.4 C323.3 712.8 342.0 586.8 425.8 558.1 C437.0 554.2 448.7 551.4 460.4 550.0 C558.3 538.4 502.3 646.7 537.1 703.2 C549.4 723.2 568.6 720.3 587.0 730.3 C644.8 761.5 646.3 781.3 721.4 776.0 Z"
                  fill="url(#splash-gB)"
                />
                <path
                  d="M494.0 725.6 C545.0 779.4 585.4 804.9 661.1 807.2 C675.5 807.6 691.3 811.3 705.1 805.6 C718.8 799.8 722.5 784.2 733.6 775.5 C747.4 764.8 797.3 741.3 814.3 740.5 C846.7 739.0 846.9 773.4 843.6 796.0 C871.4 786.3 894.1 771.0 918.1 754.3 C932.0 815.7 906.3 879.0 869.5 927.8 C875.5 935.0 881.1 941.9 886.6 948.8 C853.4 974.4 807.5 1010.6 764.0 1013.7 C746.5 1015.0 734.3 999.0 717.4 996.2 C700.4 993.4 683.6 993.2 666.9 988.3 C548.8 952.9 465.1 851.8 494.0 725.6 Z"
                  fill="url(#splash-gC)"
                />
                <path
                  d="M407.0 561.4 C445.0 489.2 534.6 463.8 610.1 482.7 C646.6 491.9 679.4 511.9 717.0 517.1 C746.4 521.1 772.3 512.3 801.1 509.9 C823.2 508.0 846.0 510.2 868.1 511.9 C830.4 595.1 724.3 589.9 649.4 608.7 C591.1 623.3 566.8 661.8 581.2 719.8 C493.5 736.3 537.5 603.6 515.9 568.9 C493.9 533.6 438.2 555.4 407.0 561.4 Z"
                  fill="url(#splash-gF)"
                />
                <path
                  d="M887.8 948.3 C881.5 941.5 875.2 934.6 869.0 927.7 C906.3 879.6 930.7 816.0 918.0 755.0 C894.0 771.7 871.3 787.0 843.4 796.4 C847.3 765.9 841.5 752.8 819.4 731.9 C857.5 702.7 893.0 669.5 907.1 622.1 C913.9 599.3 908.7 549.7 940.5 545.1 C983.6 538.8 1003.8 630.8 1007.9 661.3 C1023.0 774.2 980.5 881.5 888.1 948.7 Z"
                  fill="url(#splash-gT)"
                />
                <path
                  d="M449.7 409.8 C440.8 377.8 452.1 324.2 463.7 293.6 C468.0 282.3 476.3 260.4 491.8 262.9 C515.4 266.7 546.3 314.2 556.9 334.2 C560.8 341.5 570.9 357.2 564.9 365.4 C559.4 373.1 535.4 373.6 526.1 375.5 C506.8 379.4 488.4 387.0 471.7 397.3 C464.3 401.8 457.7 406.7 449.7 409.8 Z"
                  fill="url(#splash-gE)"
                />
              </g>

              <path
                d="M780 508 C787 492 828 488 842 503 C840 522 818 539 804 542 C789 534 780 521 780 508 Z"
                fill="#2a1a17"
              />
            </g>
          </svg>

          {/* Lightweight Unclipped Stroke-Draw Overlay (Only 2 Simple Strokes) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-14 w-14"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="splash-gCheck"
                x1="660"
                x2="870"
                y1="745"
                y2="595"
              >
                <stop offset="0" stopColor="#0b8f9b" />
                <stop offset="1" stopColor="#2fe0a8" />
              </linearGradient>
            </defs>

            <g transform="translate(32.00 32.00) scale(0.0765) translate(-632.0 -614.5)">
              <path
                className="splash-eye"
                d="M585 442 C612 428 655 438 667 474"
                fill="none"
                stroke="#3a1d14"
                strokeLinecap="round"
                strokeWidth="16"
              />

              <path
                className="splash-check"
                d="M668 678 L728 737 L862 603"
                fill="none"
                stroke="url(#splash-gCheck)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="72"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export const FoxAnimatedLogo = memo(FoxAnimatedLogoBase);
