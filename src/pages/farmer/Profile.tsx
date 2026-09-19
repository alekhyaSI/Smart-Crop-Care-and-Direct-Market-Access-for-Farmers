import { useLanguage } from '../../i18n';

interface Props {
  user: any;
  onUpdate: (u: any) => void;
}

export default function FarmerProfilePage({ user, onUpdate }: Props) {
  const { t } = useLanguage();

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">

      <div className="mb-8">
        <p className="text-sm font-medium text-[#2D6A4F] mb-2">
          {t('account')}
        </p>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#1A2E1A]">
          FARMER PROFILE NEW
        </h1>

        <p className="text-[#7A8C7A] mt-2">
          {t('manageFarmerProfile')}
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl border border-[#D4E6C3] bg-white shadow-sm">

        <div className="bg-gradient-to-r from-[#EAF7E8] via-[#F5FAF1] to-white px-6 md:px-8 py-7">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="h-20 w-20 rounded-2xl border-2 border-[#D4E6C3] bg-[#D8F3DC] flex items-center justify-center text-4xl">
                🌾
              </div>

              <div>

                <h2 className="text-xl font-semibold text-[#1A2E1A]">
                  {user.name || user.username}
                </h2>

                <p className="text-sm text-[#7A8C7A]">
                  @{user.username} • {t('farmer')}
                </p>

                <p className="text-xs text-[#7A8C7A] mt-1">
                  {user.email}
                </p>

              </div>

            </div>

            <button
              type="button"
              className="bg-[#2D6A4F] text-white px-5 py-3 rounded-xl"
            >
              {t('editProfile')}
            </button>

          </div>

        </div>

        <div className="p-6 md:p-8">

          <section>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1A2E1A]">
                {t('farmerInformation')}
              </h3>

              <p className="mt-1 text-sm text-[#7A8C7A]">
                {t('farmerInformationDetails')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InfoCard
                icon="👤"
                label={t('name')}
                value={user.name || t('notSet')}
              />

              <InfoCard
                icon="🌾"
                label={t('username')}
                value={`@${user.username}`}
              />

              <InfoCard
                icon="📍"
                label={t('location')}
                value={user.location || t('notSet')}
              />

              <InfoCard
                icon="🌱"
                label={t('cropsGrown')}
                value={user.cropsGrown || t('notSet')}
              />

            </div>

          </section>

          <div className="my-8 border-t border-[#E7EFDF]" />

          <section>

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-[#1A2E1A]">
                {t('contactInformation')}
              </h3>

              <p className="mt-1 text-sm text-[#7A8C7A]">
                {t('communicationInformation')}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InfoCard
                icon="📞"
                label={t('phone')}
                value={user.phone || t('notSet')}
              />

              <InfoCard
                icon="✉️"
                label={t('email')}
                value={user.email}
              />

            </div>

          </section>

          <div className="my-8 border-t border-[#E7EFDF]" />

          <section>

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-[#1A2E1A]">
                {t('preferences')}
              </h3>

              <p className="mt-1 text-sm text-[#7A8C7A]">
                {t('customizeExperience')}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InfoCard
                icon="🌐"
                label={t('preferredLanguage')}
                value={user.preferredLanguage}
              />

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

function InfoCard({
  icon,
  label,
  value
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E1ECD8] bg-[#FBFDF9] p-5">

      <div className="mb-3 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7E8] text-lg">
          {icon}
        </div>

        <span className="text-sm text-[#7A8C7A]">
          {label}
        </span>

      </div>

      <p className="break-words text-base font-medium text-[#1A2E1A]">
        {value}
      </p>

    </div>
  );
}