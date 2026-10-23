import type { LocalizedGymProfile } from "@/features/gym-profile/domain/profile";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = {
  gym: LocalizedGymProfile;
  t: Dictionary["shell"];
};

export function SiteFooter({ gym, t }: Props) {
  const { address, phone, email, socialLinks } = gym;
  return (
    <footer className="border-t border-foreground/15">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:flex-row md:gap-16">
        <section>
          <h2 className="mb-2 font-semibold">{t.contact}</h2>
          <address className="not-italic leading-relaxed">
            {address.street}
            <br />
            {address.postcode} {address.city}
            <br />
            <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
            <br />
            <a href={`mailto:${email}`}>{email}</a>
          </address>
        </section>
        {socialLinks.length > 0 && (
          <section>
            <h2 className="mb-2 font-semibold">{t.social}</h2>
            <ul className="leading-relaxed">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url}>{link.platform}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="md:ml-auto md:self-end">
          © {new Date().getFullYear()} {gym.name}
        </p>
      </div>
    </footer>
  );
}
