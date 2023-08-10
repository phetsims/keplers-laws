# Kepler's Laws Model Notes

The Kepler's Laws PhET simulation allows you to directly interact with the famous Planetary Laws first proposed by Johannes Kepler in the 17th century. The simulation is divided into four screens: one for each law, and a final screen that contains all three of them. 

To better grasp the concepts behind the laws, the user interacts with an orbiting planet by changing its position and velocity. The simulation then calculates the orbit and displays it on the screen. In the third law the user can also change the mass of star, and the simulation will update the orbit accordingly.

Below, there's a more in depth explanation of the inner workings for each particular screen.

## First Law
**Planets move around the Sun in ellipses, with the Sun at one focus.** (1)

The idea of the first screen is to introduce the concept of an ellipse, along with its geometrical components: foci, axes, semi major and semiminor axis, and eccentricity. All of those elements can be visualized by toggling checkboxes on the UI.

There's also an option to see the strings: the lines that connect the planet to the foci. The strings are used to show that the planet is always at the same distance from the foci, and that the sum of the distances from the foci to the planet is constant, and it's equal to the major axis.

When eccentricity is toggled, a panel on the left will show the orbital eccentricity compared to other orbits of the solar system. Such as the Earth, or Halley's comet. The eccentricity is calculated as the ratio between the distance between the foci and the length of the major axis.

## Second Law

**The line connecting the Sun to a planet sweeps
equal areas in equal times.** (1)

The second screen will show a different visual of the orbit: Depending on the selected number of period divisions, the total area of the ellipse will be divided in N sections, which at a first glance might appear different, but are actually equal in surface area. When playing with the orbit, there's multiple ways in which the user might notice that all areas have the same value, such as number displays, or the bar graph on the left.

When the user presses play, the areas will disappear and the planet will start swiping. If the sound is on, you'll hear a perfect metronome ticking to the beat of the planet's movement. Thus indicating that all the areas are covered in the same amount of time, regardless of their position on the ellipse.

To further prove the point, the user can toggle Periapsis and Apoapsis, which will show the planet at its closest and farthest points from the Sun. And it will be visible that the planet moves the fastest when it's closest to the sun (Periapsis) and vice-versa.

## Third Law
**The square of the orbital period of a planet is proportional
to the cube of the mean distance from the Sun** (1)

For this law, the user will see a graph of T vs a (Period vs Semi major axis). When the user moves the planet around, the graph will start populating with the newly drawn orbits. The result of T/a is also displayed, varying from orbit to orbit.

However, the user can select the exponent of _T_ and _a_ from buttons next to the graph. When the correct combination is chosen (_T_ squared and _a_ cubed), the fraction result turns green and a sound indicates that they've reached the correct form of the Law. Besides, the line in the graph will become linear.

## Other notes on the sim

### Elliptical Orbit Engine
To properly calculate the orbit, a series of equations are used to determine the orbital parameters at any moment in time. If you're interested in finding out more about the math behind the simulation, you can check out the [implementation notes](implementation-notes.md).

### Types of orbit
In general, as the First Law states, all orbits bound to the sun will be ellipses. Even circular ones with eccentricity 0. Within the sim there are also two types of forbidden orbit: The crash trajectory, which is when the periapsis of the orbit is inside the Sun; and the escape trajectory, which is when the velocity of the body would allow it to escape the system. In both cases the sim will stop.

### Units
The units were chosen to properly portray the scales of astronomical systems with manageable numbers:
* Distance: Astronomical Units (AU) equal to the distance between the Earth and the Sun. Or 149,597,870,700 meters.
* Mass: Solar Masses (M☉) equal to 1.99 × 10^30 kilograms.
* Time: Years (yr)
* Velocity: km/s

### Distances and Sizes
The bodies sizes are greatly exaggerated, as using the same scale for distances and sizes would render all bodies as invisible points. For example, the real solar radius is about 0.004 AU, but in the sim it is displayed as 0.15 AU. Additionally, typical gravitational systems usually have enormous distances between bodies, even when measured in AUs, but most of the sim pre-sets show them in the same range of ~5AU in size.

### Areas
The elliptical areas are calculated and displayed as AU^2. However, this is mostly to drive home the equality of those areas. In real life examples of Kepler's Laws the areas are rarely calculated, and when they are, AU^2 is not really the best unit to use.

### Parabolic Trajectories
When bodies reach escape speed in real life, their orbit becomes an escape parabola (or hyperbola if the velocity is higher). However, in the sim, the velocity will stop exactly before escape speed, thus displaying a highly elliptical trajectory, almost a parabola. This is done to avoid the orbit calculations from breaking down, and having to smoothly change shapes from ellipse to parabola. You might notice this in some edge cases, but most of the time, the escape orbit will look like a parabola.

## References
1. https://pwg.gsfc.nasa.gov/stargaze/Kep3laws.htm