# Bubatz Club

![bubatz-img](https://pbs.twimg.com/profile_banners/1550078321303625740/1685367141/1500x500)

Welcome to Bubatz Club Manager, a management tool designed to support Cannabis Social Clubs (CSC) in Germany. This platform helps clubs manage their members, finances, cannabis output, and plant management, ensuring compliance with legal requirements.

## Purpose

The Bubatz Club Manager is a Software-as-a-Service (SaaS) platform tailored for CSCs. It streamlines administrative tasks, making it easier for clubs to focus on their core activities. Key features include member management, financial tracking, automated reports, and compliance documentation.

## Planned Features

- **Member Management**: Easily manage members
- **Member Management Payment**: Easily manage members pamynet like yearly membership fee,
- **Output Management**: Track the amount of cannabis a user has received in the past and is legally allowed to have according to German law.
- **Plant Management**: Monitor the entire lifecycle of your plants, including their current growth status, expected yield, and other key details.
- **CSV Import/Export**: Import members from existing lists and export data for use in other software.
- **Automated Reports**: Generate reports to track club performance over time.
- **Financial Tracking**: Keep track of expenses and revenues with detailed reports.
- **Compliance**: Ensure legal compliance with documentation and reporting features. |

## Tech Stack

- **Next.js 14**: For building a fast, modern web application.
- **Supabase**: As the backend database, offering real-time capabilities.
- **Tailwind CSS**: For a sleek, responsive design.
- **shadcn**: Enhancing the UI with interactive components.
- **Zod**: Ensuring data validation and type safety.
- **Drizzle ORM**: Simplifying database interactions.

## Getting Started

To get started with Bubatz Club:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-repo/bubatz-club.git
   cd bubatz-club
   ```

2. **Create an account in Supabase**: Visit [Supabase](https://supabase.com) and create a new project. Note down your project details.

3. **Set up environment variables**: Create a `.env` file in the root of your project and add your Supabase project details.

   ```sh
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the migrations**:

   ```sh
   npm run drizzle:migrate
   ```

5. **Start project**:
   ```sh
   npm run dev
   ```

## Contact

For assistance, feature requests, or data import help, contact us at [contact@bubatz.club](mailto:contact@bubatz.club).
Join my personal discord if you like https://discord.gg/2wSR6GPgB5

Best wishes -Johannes Hayer
