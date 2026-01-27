# Enchanted Archives Projects Redesign

Transform the projects section into "Hermione's Enchanted Archives" — a creative, image-free library-themed display.

## Proposed Changes

### 1. HTML Structure (`index.html`)
*   **Rename Grid**: Change `.magical-grid` to `.archives-container`.
*   **New Card Structure**: Wrap project info in `.book-card` elements instead of standard cards.
*   **Remove Links**: Remove explicit `.magical-link` buttons; make the entire card interactable.
*   **Unique Attributes**: Add custom "book-side" ribbons or bookmarks via CSS.
*   **Layout Spacing**: Increase horizontal gap (`column-gap`) in `.archives-container` to 3rem for better separation.

### 2. CSS Styling (`css/wizarding-theme.css`)
*   **Archive Layout**: High-end bento-style arrangement with varying card heights.
*   **Book Presentation**:
    *   3D skew/tilt on hover to simulate picking up a book.
    *   Faux leather backgrounds with parchment-style text.
    *   Glowing runes and gold leaf borders.
*   **Aesthetics**:
    *   Color Palette: Deep Plum, Midnight Navy, Ancient Gold, Aged Parchment.
    *   Interactive Glow: Hover emits a "Lumos" warm light.
    *   Typography: Elegant serif for titles.

### 3. Differentiated Section Designs
*   **Education (Admission Letters)**:
    *   **3D Envelope Flap**: Added an interactive flap that opens on hover using CSS 3D transforms.
    *   **Sliding Parchment**: The degree parchment now slides out of the envelope when opened.
    *   **Magical Sparkles**: Subtle glowing particles that appear around the letter on hover.
    *   **Skills (Enchanted Runes - Primary UI)**:
    - **Rune Tablets**: Dark, textured stone tablets represented by `.rune-tablet`.
    - **Glowing Symbols**: Large, ancient-style icons (using Unicode or SVG paths) that glow with house-themed energy.
    - **Physical Engraving**: CSS inner shadows to simulate symbols carved into stone.
    - **Skill List**: Descriptive text for each spell category below the runes.
    - **2-Column Layout**: Update `runes-grid` to display items in rows of two where space permits.
    - **Centered Orphan**: Apply `grid-column: span 2` to the third rune card to center it in the second row.
*   **Skills (Potions Cabinet)**:
    *   **Realistic Glass Styling**: Added a pseudo-element for the vial neck and shoulder to create a classic bottle silhouette.
    *   **Glossy Reflexes**: Implemented white vertical sheens to simulate light reflecting off curved glass.
    *   **Liquid Realism**: Added a curved meniscus (top surface) to the potion liquid using relative positioning.
    *   **Ethereal Particles**: Refined bubbles to be smaller, varying in size, and emitting a soft glow.
    *   **Magical Mist**: Enhanced the cork vapor with a pulsing, blurred aura.
    *   **Dynamic Glow**: Added a color-coded outer glow that pulses with magical energy on hover.

### 4. Polish & Interaction
*   **Micro-animations**: Floating letters, bubbling potions, and hover-triggered reveals.
*   **Responsive**: Ensure the letters and vials scale well on mobile while maintaining their magical charm.

### 5. Great Hall of Knowledge (Merged Sections)
*   **Unified Container**: Combine Education and Skills into a single `<section id="knowledge">`.
*   **Vertical Partition**:
    *   Use `display: grid` with two columns for desktop.
    *   Add a subtle magical "border-right" or glowing separator between columns.
*   **Layout**:
    *   **Left Side (Admissions)**: Re-center the floating letters.
    *   **Right Side (Potions)**: Arrange the vials in a vertical or compact grid.
*   **Responsive**: Stack the columns vertically on mobile devices.

### 7. Section Compaction (Vertical Focus)
*   **Reduce Vertical Padding**: Decrease top and bottom padding of the `#knowledge` section to make it shallower.
*   **Tighten Component Gaps**:
    *   Reduce `knowledge-subtitle` margin-bottom to 2.5rem (balancing proximity and clearance).
    *   Tighten `admissions-grid` vertical gaps to 3rem.
    *   Reduce top padding of the `admissions-grid` to the minimum required for hover.
    *   Reduce `potions-grid` gaps and column padding.
    *   Shorten the `knowledge-divider` min-height to ~250px to allow the container to shrink vertically.

## Verification
*   Check that zero external images are used.
*   Verify Admission Letters and Potion Vials maintain their original sizes.
*   Confirm total section height is reduced.
*   **Safety Check**: Ensure letters still clear the subtitle on hover after gap reduction.

