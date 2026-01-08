# English Learning Website

Website học tiếng Anh được xây dựng với Next.js 15, React 19, Tailwind CSS v3 và shadcn/ui.

## 🚀 Tech Stack

- **Next.js 15** - React framework với App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components (đã cấu hình sẵn)
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production build
npm start

# Lint code
npm run lint
```

## 🎨 Thêm shadcn/ui components

Project đã được cấu hình sẵn cho shadcn/ui. Để thêm components:

```bash
# Ví dụ: Thêm Button component
npx shadcn@latest add button

# Thêm Card component
npx shadcn@latest add card

# Xem danh sách components có sẵn
npx shadcn@latest add
```

## 📁 Cấu trúc thư mục

```
src/
├── app/              # App Router pages
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   └── ui/          # shadcn/ui components (sẽ được tạo khi add)
├── lib/             # Utility functions
│   └── utils.ts     # cn() helper
├── hooks/           # Custom React hooks
└── styles/
    └── globals.css  # Global styles + Tailwind
```

## 🎯 Features đã setup

- ✅ Next.js 15 với App Router
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v3 với custom theme
- ✅ shadcn/ui configuration
- ✅ ESLint configuration
- ✅ CSS Variables cho theming
- ✅ Dark mode support (sẵn sàng)
- ✅ Path aliases (`@/*`)

## 🔧 Cấu hình

### Tailwind CSS

File `tailwind.config.js` đã được cấu hình với:
- CSS variables cho colors
- Custom theme cho shadcn/ui
- Dark mode support

### TypeScript

File `tsconfig.json` sử dụng:
- Path alias `@/*` -> `src/*`
- Strict mode enabled
- Module resolution: bundler

### Components

File `components.json` đã được tạo sẵn cho shadcn/ui với:
- Style: default
- Base color: slate
- CSS variables: enabled

## 🌐 Development

Server chạy tại: http://localhost:3000

## 📝 Notes

- Đã loại bỏ các dependencies không cần thiết (Jest, Storybook, Prettier plugins, Husky)
- Giữ lại cấu hình cơ bản, sạch sẽ cho dự án mới
- Sẵn sàng tích hợp shadcn/ui components

```
corepack use pnpm@`pnpm -v` && pnpm i
```

You can see the results locally in production mode with:

```shell
pnpm build
```

```shell
pnpm start
```

## :gear: Generating components

```bash
pnpm generate Button
```

Result (if you chose an atom component):

```
└── components
      └── atoms
        └── Button
          ├── index.ts
          ├── Button.stories.tsx
          ├── Button.test.tsx
          └── Button.tsx
```

## 🤝 Contributing

1. Fork this repository;
2. Create your branch: `git checkout -b my-awesome-contribution`;
3. Commit your changes: `git commit -m 'feat: Add some awesome contribution'`;
4. Push to the branch: `git push origin my-awesome-contribution`.

## License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.

---

Made with much :heart: and :muscle: by Mateusz Hadryś :blush: <a href="https://www.linkedin.com/in/mateusz-hadry%C5%9B/">My Contact</a>
