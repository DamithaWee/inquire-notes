import React, { useRef, useEffect } from "react";

const GridWormEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let lastTime = 100;
    let SCREEN_WIDTH, SCREEN_HEIGHT;

    // Get the current browser window size (with a small offset)
    const getBrowserWindowSize = () => {
      const offset = 20;
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      return { x: width - offset, y: height - offset };
    };

    // Get the canvas and context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const browserWindowSize = getBrowserWindowSize();
    canvas.width = browserWindowSize.x;
    canvas.height = browserWindowSize.y;
    SCREEN_WIDTH = browserWindowSize.x;
    SCREEN_HEIGHT = browserWindowSize.y;

    // -----------------------------
    // GridWorm Class
    // -----------------------------
    class GridWorm {
      constructor(point, interval, pointsList, screenWidth, screenHeight) {
        this.radius = 2;
        this.xCoord = point.x;
        this.yCoord = point.y;
        this.interval = interval;
        this.color = this.getColor(1, true);
        this.mainColor = this.color.color;
        this.mainColorIndex = this.color.index;
        this.nColor = this.getColor(1, true);
        this.arrowHeadColor = this.nColor.color;
        this.arrowHeadColorIndex = this.nColor.index;
        this.pointsList = pointsList;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.speed = 2; // slowed down from 5 to 2
        this.velocity = this.getVelocity();
        this.junctionMemory = [{ point: point, velocity: this.velocity }];
        this.junctionMemoryLength = 6;
      }

      getColor(opacity, isRandom = true, index = 0) {
        if (opacity < 0 || opacity > 1 || opacity === null || isNaN(opacity)) {
          opacity = 1;
        }
        const colors = [
          `rgba(0,0,0,${opacity})`,
          `rgba(192,192,192,${opacity})`,
          `rgba(128,128,128,${opacity})`,
          `rgba(128,0,0,${opacity})`,
          `rgba(255,0,0,${opacity})`,
          `rgba(0,255,0,${opacity})`,
          `rgba(0,0,255,${opacity})`,
          `rgba(255,0,255,${opacity})`,
          `rgba(128,128,0,${opacity})`,
          `rgba(0,128,0,${opacity})`,
          `rgba(128,0,128,${opacity})`,
          `rgba(0,128,128,${opacity})`,
          `rgba(0,0,128,${opacity})`,
          `rgba(138,57,0,${opacity})`,
          `rgba(205,133,63,${opacity})`,
          `rgba(244,164,96,${opacity})`,
          `rgba(139,105,30,${opacity})`,
          `rgba(165,42,42,${opacity})`,
          `rgba(178,34,34,${opacity})`,
          `rgba(220,20,60,${opacity})`,
          `rgba(255,140,0,${opacity})`,
          `rgba(255,165,0,${opacity})`,
          `rgba(255,215,0,${opacity})`,
          `rgba(184,134,11,${opacity})`,
          `rgba(218,165,32,${opacity})`,
          `rgba(218,165,32,${opacity})`,
          `rgba(238,232,170,${opacity})`,
          `rgba(189,183,107,${opacity})`,
          `rgba(240,230,140,${opacity})`,
          `rgba(0,100,0,${opacity})`,
          `rgba(34,139,34,${opacity})`,
          `rgba(32,178,170,${opacity})`,
          `rgba(47,79,79,${opacity})`,
          `rgba(0,139,139,${opacity})`,
          `rgba(95,158,160,${opacity})`,
          `rgba(70,130,180,${opacity})`,
          `rgba(25,25,112,${opacity})`,
          `rgba(0,0,128,${opacity})`,
          `rgba(0,0,139,${opacity})`,
          `rgba(72,61,139,${opacity})`,
          `rgba(75,0,130,${opacity})`,
          `rgba(139,0,139,${opacity})`,
          `rgba(0,0,0,${opacity})`,
          `rgba(105,105,105,${opacity})`,
          `rgba(169,169,169,${opacity})`,
        ];

        if (isRandom) {
          const randomIndex = Math.floor(
            this.getRandomNumber(0, colors.length)
          );
          return { color: colors[randomIndex], index: randomIndex };
        } else {
          if (index >= 0 && index < colors.length) {
            return { color: colors[index], index };
          }
          return { color: colors[0], index: 0 };
        }
      }

      getVelocity() {
        let x, y;
        if (Math.random() > 0.5) {
          x = 0;
          y = Math.random() > 0.5 ? -this.speed : this.speed;
        } else {
          x = Math.random() > 0.5 ? -this.speed : this.speed;
          y = 0;
        }
        return { x, y };
      }

      getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
      }

      drawCircle(x, y, circleradius, ctx, colorIndex) {
        for (let i = 0; i < 3; i++) {
          let color = "";
          let radius = 0;
          switch (i) {
            case 0:
              radius = circleradius;
              color = this.getColor(1, false, colorIndex).color;
              break;
            case 1:
              radius = circleradius * 2;
              color = this.getColor(0.5, false, colorIndex).color;
              break;
            case 2:
              radius = circleradius * 6;
              color = this.getColor(0.2, false, colorIndex).color;
              break;
            default:
              break;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      }

      drawArrowHead(x, y, circleradius, ctx, colorIndex) {
        const points = [];
        if (this.velocity.x === 0) {
          if (this.velocity.y > 0) {
            points.push({ x: x + this.interval / 3, y });
            points.push({ x: x - this.interval / 3, y });
            points.push({ x, y: y + this.interval / 3 });
          } else {
            points.push({ x: x + this.interval / 3, y });
            points.push({ x: x - this.interval / 3, y });
            points.push({ x, y: y - this.interval / 3 });
          }
        } else {
          if (this.velocity.x > 0) {
            points.push({ x: x + this.interval / 3, y });
            points.push({ x, y: y - this.interval / 3 });
            points.push({ x, y: y + this.interval / 3 });
          } else {
            points.push({ x: x - this.interval / 3, y });
            points.push({ x, y: y - this.interval / 3 });
            points.push({ x, y: y + this.interval / 3 });
          }
        }
        points.forEach((point) => {
          this.drawCircle(point.x, point.y, circleradius / 2, ctx, colorIndex);
        });
        this.drawTriangle(points[0], points[1], points[2], ctx);
      }

      drawTriangle(point1, point2, point3, ctx) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fill();
      }

      draw(ctx) {
        // Draw head and arrow head
        this.drawCircle(
          this.xCoord,
          this.yCoord,
          this.radius / 2,
          ctx,
          this.mainColorIndex
        );
        this.drawArrowHead(
          this.xCoord,
          this.yCoord,
          this.radius / 2,
          ctx,
          this.arrowHeadColorIndex
        );

        // Draw visited junctions with smaller squares
        for (let i = 0; i < this.junctionMemory.length; i++) {
          const junction =
            this.junctionMemory[this.junctionMemory.length - (i + 1)];
          this.drawCircle(
            junction.point.x,
            junction.point.y,
            this.radius / 2,
            ctx,
            this.mainColorIndex
          );
          const squareSize = this.interval / 2;
          ctx.fillStyle = this.getColor(0.1, false, this.mainColorIndex).color;
          ctx.fillRect(
            junction.point.x - squareSize / 2,
            junction.point.y - squareSize / 2,
            squareSize,
            squareSize
          );
        }

        // Draw connecting line (body) using right-angled segments
        ctx.strokeStyle = "black";
        ctx.lineWidth = this.radius;
        ctx.beginPath();
        // Start from the head
        let startPoint = { x: this.xCoord, y: this.yCoord };
        ctx.moveTo(startPoint.x, startPoint.y);
        // Iterate through the junction memory (in reverse order)
        for (let i = 0; i < this.junctionMemory.length; i++) {
          const junction =
            this.junctionMemory[this.junctionMemory.length - (i + 1)].point;
          // If both coordinates differ, split into horizontal then vertical segments.
          if (startPoint.x !== junction.x && startPoint.y !== junction.y) {
            ctx.lineTo(junction.x, startPoint.y);
            ctx.lineTo(junction.x, junction.y);
          } else {
            ctx.lineTo(junction.x, junction.y);
          }
          startPoint = { x: junction.x, y: junction.y };
        }
        ctx.stroke();
        ctx.closePath();
      }

      update(deltaTime) {
        this.junctionMemoryLength =
          this.junctionMemoryLength < 1 ? 1 : this.junctionMemoryLength;
        // Move the worm's head
        this.xCoord += this.velocity.x;
        this.yCoord += this.velocity.y;

        // Bounce off the edges
        if (this.xCoord <= this.interval) {
          this.xCoord = this.interval;
          this.velocity.x = -this.velocity.x;
          this.xCoord += this.velocity.x * 3;
        }
        if (this.xCoord >= this.screenWidth - this.interval) {
          this.xCoord =
            this.junctionMemory[this.junctionMemory.length - 1].point.x;
          this.velocity.x = -this.velocity.x;
          this.xCoord += this.velocity.x * 3;
        }
        if (this.yCoord <= this.interval) {
          this.yCoord = this.interval;
          this.velocity.y = -this.velocity.y;
          this.yCoord += this.velocity.y * 3;
        }
        if (this.yCoord >= this.screenHeight - this.interval) {
          this.yCoord =
            this.junctionMemory[this.junctionMemory.length - 1].point.y;
          this.velocity.y = -this.velocity.y;
          this.yCoord += this.velocity.y * 4;
        }

        const currentCoord = { x: this.xCoord, y: this.yCoord };
        const latestJunction = this.getJunctionReached(currentCoord);
        if (
          latestJunction.x !== currentCoord.x ||
          latestJunction.y !== currentCoord.y
        ) {
          const originalVelocity = this.velocity;
          const newVelocity = this.getVelocity();
          if (originalVelocity.y === 0) {
            this.velocity = newVelocity;
            if (
              !(newVelocity.y === 0 && newVelocity.x === -originalVelocity.x)
            ) {
              const memory = { point: latestJunction, velocity: this.velocity };
              if (!this.isInMemory(memory)) {
                this.junctionMemory.push(memory);
              }
            }
            this.xCoord += this.velocity.x * 3;
          } else {
            this.velocity = newVelocity;
            if (
              !(newVelocity.x === 0 && newVelocity.y === -originalVelocity.y)
            ) {
              const memory = { point: latestJunction, velocity: this.velocity };
              if (!this.isInMemory(memory)) {
                this.junctionMemory.push(memory);
              }
            }
            this.yCoord += this.velocity.y * 3;
          }
        }
        if (this.junctionMemory.length > this.junctionMemoryLength) {
          this.junctionMemory.shift();
        }
      }

      isInMemory(memory) {
        return this.junctionMemory.some(
          (mem) =>
            mem.point.x === memory.point.x && mem.point.y === memory.point.y
        );
      }

      // Increased threshold for more frequent turns
      getJunctionReached(currentCoord) {
        for (let i = 0; i < this.pointsList.length; i++) {
          const point = this.pointsList[i];
          if (
            Math.abs(currentCoord.x - point.x) > 2 * this.interval ||
            Math.abs(currentCoord.y - point.y) > 2 * this.interval
          ) {
            continue;
          }
          const distance = this.getDistance(currentCoord, point);
          if (distance <= this.radius * 3) {
            return point;
          }
        }
        return currentCoord;
      }

      getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      }

      // Placeholder for window resize handling
      refreshScreenSize(screenHeight, screenWidth, dx, dy, points) {}
    }

    // -----------------------------
    // Painter Class
    // -----------------------------
    class Painter {
      constructor(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.interval = 40;
        this.points = this.createPoints();
        this.gridWorms = this.createGridWorms();
        this.color = this.getRandomColor(0.1);
        document.addEventListener("click", () => {
          this.points = this.createPoints();
          this.gridWorms = this.createGridWorms();
          this.color = this.getRandomColor(0.1);
        });
      }

      createGridWorms() {
        const gridworms = [];
        const numOfGridWorms = 30;
        for (let i = 0; i < numOfGridWorms; i++) {
          const point =
            this.points[
              Math.floor(this.getRandomNumber(0, this.points.length))
            ];
          gridworms.push(
            new GridWorm(
              point,
              this.interval,
              this.points,
              this.screenWidth,
              this.screenHeight
            )
          );
        }
        return gridworms;
      }

      createPoints() {
        const points = [];
        const interval = this.interval;
        for (let y = interval; y < this.screenHeight; y += interval) {
          if (y + interval > this.screenHeight) continue;
          for (let x = interval; x < this.screenWidth; x += interval) {
            if (x + interval > this.screenWidth) continue;
            points.push({ x, y });
          }
        }
        return points;
      }

      getRandomColor(opacity) {
        const colors = [
          `rgba(255,0,0,${opacity})`,
          `rgba(255,242,0,${opacity})`,
          `rgba(0,0,255,${opacity})`,
          `rgba(255,255,0,${opacity})`,
          `rgba(0,255,255,${opacity})`,
          `rgba(255,0,255,${opacity})`,
          `rgba(192,192,192,${opacity})`,
          `rgba(128,128,128,${opacity})`,
          `rgba(128,0,0,${opacity})`,
          `rgba(128,128,0,${opacity})`,
          `rgba(0,128,0,${opacity})`,
          `rgba(128,0,128,${opacity})`,
          `rgba(0,128,128,${opacity})`,
          `rgba(0,0,128,${opacity})`,
          `rgba(0,255,0,${opacity})`,
          `rgba(77,0,255,${opacity})`,
          `rgba(255,0,140,${opacity})`,
          `rgba(0,255,0,${opacity})`,
        ];
        return colors[parseInt(this.getRandomNumber(0, colors.length))];
      }

      getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
      }

      refreshScreenSize(screenHeight, screenWidth) {
        if (
          this.screenHeight !== screenHeight ||
          this.screenWidth !== screenWidth
        ) {
          this.screenHeight = screenHeight;
          this.screenWidth = screenWidth;
          this.points = this.createPoints();
          this.gridWorms = this.createGridWorms();
        }
      }

      update(deltaTime) {
        this.gridWorms.forEach((gridworm) => {
          gridworm.update(deltaTime);
        });
      }

      draw(ctx) {
        this.gridWorms.forEach((gridworm) => {
          gridworm.draw(ctx);
        });
      }
    }

    // Create a Painter instance
    let painter = new Painter(SCREEN_WIDTH, SCREEN_HEIGHT);

    // Clear and update the canvas each frame
    const updateCanvas = () => {
      ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    };

    // Adjust canvas size on window resize
    const onWindowResize = () => {
      const windowSize = getBrowserWindowSize();
      canvas.width = windowSize.x;
      canvas.height = windowSize.y;
      SCREEN_WIDTH = windowSize.x;
      SCREEN_HEIGHT = windowSize.y;
    };
    window.addEventListener("resize", onWindowResize);

    // Animation loop using requestAnimationFrame
    const animationLoop = (timestamp) => {
      updateCanvas();
      painter.refreshScreenSize(SCREEN_HEIGHT, SCREEN_WIDTH);
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      painter.update(deltaTime);
      painter.draw(ctx);
      animationFrameId = requestAnimationFrame(animationLoop);
    };
    animationFrameId = requestAnimationFrame(animationLoop);

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ backgroundColor: "white" }} />;
};

export default GridWormEffect;
