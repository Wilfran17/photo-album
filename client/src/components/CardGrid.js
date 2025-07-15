import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

const cardsData = [
  "https://www.yorkshire.com/wp-content/uploads/2022/09/leeds-headrow-and-town-hall-at-night.jpg",
  "https://media.snl.no/media/138313/standard_OSEBERGSKIPET..jpg",
  "https://www.aparisguide.com/champs-elysees/champs-elysees001.jpg",
  "https://wp.clutchpoints.com/wp-content/uploads/2024/05/Charles-Leclercs-heartfelt-message-to-Ferrari-fans-after-Monaco-Grand-Prix-win.jpg",
  "https://cdn.sanity.io/images/jjv48zaf/production/b47796f9f66575ae3ced936512e57543e83ce26a-600x600.jpg?w=2048&q=75&fit=fillmax&auto=format",
  "https://is.zobj.net/image-server/v1/images?r=HAdYH83zSS9MCCjsYoAf3QtFZViFk-Mm8TJMQ8j1u8RPFu7bmy5BwY4j9bE-BU-Th3rr-d67ssrJIpGdrMgZ033jdIkvNp-GIyuYPbheu7GYiXz2bRICuIoHhjHIikYsIJcPb24Ks4N1C1Id6-baRaiAB3Gl-RrEpi77T_PYQeqikIPY-N_p4eal342syUO093HsQroM8YGJduSDi9yYPcEtZ2vIZ2_rnR35fPO4Xve8AnTiwVicOCYPL1E",
];

export default function CardGrid() {
  const [rotationY, setRotationY] = useState(0);
  const [radius, setRadius] = useState(window.innerWidth < 768 ? 200 : 500); // Dynamisk radius
  const dragging = useRef(false);
  const lastX = useRef(0);
  const cardCount = cardsData.length;
  const angleStep = 360 / cardCount;

  // Automatisk rotasjon
  useEffect(() => {
    let frameId;
    const animate = () => {
      if (!dragging.current) {
        setRotationY((prev) => prev + 0.05); // Juster hastighet her
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Dynamisk oppdater radius ved vindusstørrelse
  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 200 : 500);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Kjør én gang direkte
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dra-funksjoner for mus
  const onMouseDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const deltaX = e.clientX - lastX.current;
    setRotationY((prev) => prev + deltaX * 0.5);
    lastX.current = e.clientX;
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  // Dra-funksjoner for touch
  const onTouchStart = (e) => {
    dragging.current = true;
    lastX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;
    const deltaX = e.touches[0].clientX - lastX.current;
    setRotationY((prev) => prev + deltaX * 0.5);
    lastX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    dragging.current = false;
  };

  // Gå til spesifikt kort via knapp
  const goToIndex = (index) => {
    setRotationY(-index * angleStep);
  };

  return (
    <main className="main">
      <section
        className="cards carousel"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateZ(-${radius}px) rotateY(${rotationY}deg)`,
        }}
      >
        {cardsData.map((src, i) => {
          const angle = i * angleStep;
          return (
            <div
              key={i}
              className="card"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                zIndex: 1,
              }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                onClick={(e) => e.preventDefault()}
                style={{ pointerEvents: "none", userSelect: "none" }}
              />
            </div>
          );
        })}
      </section>

      <div className="carousel-buttons">
        {cardsData.map((_, index) => (
          <button
            key={index}
            className="carousel-button"
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </main>
  );
}
