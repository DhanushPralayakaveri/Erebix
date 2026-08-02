# Erebix Theming Guide

Erebix is built with a highly flexible Semantic CSS Variable architecture, leveraging Tailwind CSS v4 and `next-themes`. This allows you to add custom themes (like Cyberpunk, Synthwave, or anything else) without changing *any* component files.

## How the Theming System Works

All colors in the app (backgrounds, text, borders, buttons) are mapped to abstract variables (e.g., `bg-card`, `text-primary`, `border-border`). These variables point to specific HSL/Hex color values defined centrally in `src/app/globals.css`. 

When a user switches themes, `next-themes` applies a class (like `.hades-light` or `.cyber-dark`) to the root `<html>` element. This triggers `globals.css` to instantly swap the color palette across the entire application.

## How to Add a New Theme

To add a completely new theme (e.g., "Synthwave Dark"), follow these 3 simple steps:

### Step 1: Define the Theme Palette in `globals.css`

Open `frontend/src/app/globals.css` and add your new theme class. Copy an existing theme block and modify the colors:

```css
/* Synthwave Dark Theme */
.synthwave-dark {
  --background: #0f0a1d; 
  --foreground: #e2e8f0; 
  --card: #18112a; 
  --border: #bc13fe; /* Neon Purple */
  
  --primary: #ff007f; /* Hot Pink */
  --primary-foreground: #ffffff;
  
  --muted: rgba(188, 19, 254, 0.15);
  --muted-foreground: #bc13fe;
  
  --accent: #00f0ff; /* Cyan */
  --accent-foreground: #000000;
  
  --danger: #ef4444; 
  --danger-foreground: #ffffff;
  
  --success: #34d399; 
  --success-foreground: #022c22; 
  
  --warning: #f59e0b; 
  --warning-foreground: #451a03; 

  --glow-red: rgba(255, 0, 127, 0.3);
  --glow-green: rgba(0, 240, 255, 0.3);
}
```

If your theme has special layout requirements (like sharp corners, special fonts, or animations), you can also register a custom Tailwind variant at the bottom of `globals.css`:
```css
@custom-variant synthwave (&:is(.synthwave-dark *));
```
*(This allows you to write classes like `synthwave:rounded-none` directly in your React components!)*

### Step 2: Register the Theme in `layout.tsx`

Open `frontend/src/app/layout.tsx` and add your new theme name to the `themes` array of the `ThemeProvider`:

```tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="dark" 
  themes={['light', 'dark', 'hades-light', 'hades-dark', 'cyber-light', 'cyber-dark', 'synthwave-dark']} 
  enableSystem={false}
>
```

### Step 3: Add a Toggle Button

Finally, give users a way to activate your theme. Update the dropdown menus in:
- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/components/Layout/Topbar.tsx`

Add a new button for your theme:
```tsx
<button
  onClick={() => { setTheme('synthwave-dark'); setShowThemeDropdown(false); }}
  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors ${theme === 'synthwave-dark' ? 'text-primary font-bold' : 'text-foreground'}`}
>
  <Moon className="w-4 h-4 text-primary" /> Synthwave
</button>
```

That's it! Your new theme will now automatically apply across every single page and component in the application.
