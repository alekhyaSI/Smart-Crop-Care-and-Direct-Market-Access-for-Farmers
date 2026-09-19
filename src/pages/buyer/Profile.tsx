import { useRef, useState } from 'react';
import { User as UserType, LANGUAGES } from '../../data';
import { Input, Select, Btn } from '../../components/shared';
import { useLanguage } from '../../i18n';

interface Props {
  user: UserType;
  onUpdate: (u: UserType) => void;
}

export default function FarmerProfilePage({
  user,
  onUpdate
}: Props) {
  const { t } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    user.name || ''
  );

  const [phone, setPhone] = useState(
    user.phone || ''
  );

  const [location, setLocation] = useState(
    user.location || ''
  );

  const [lang, setLang] = useState(
    user.preferredLanguage || 'English'
  );

  const [crops, setCrops] = useState(
    user.cropsGrown || ''
  );

  const [profileImage, setProfileImage] = useState<string>(() => {
    return (
      localStorage.getItem(
        `kisansetu_profile_image_${user.username}`
      ) || ''
    );
  });

  const [saved, setSaved] = useState(false);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(t('validImage'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t('imageTooLarge'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result as string;

      setProfileImage(image);

      localStorage.setItem(
        `kisansetu_profile_image_${user.username}`,
        image
      );
    };

    reader.readAsDataURL(file);

    e.target.value = '';
  }

  function removeImage() {
    setProfileImage('');

    localStorage.removeItem(
      `kisansetu_profile_image_${user.username}`
    );
  }

  function save() {
    const updatedUser: UserType = {
      ...user,
      name,
      phone,
      location,
      preferredLanguage:
        lang as UserType['preferredLanguage'],
      cropsGrown: crops
    };

    onUpdate(updatedUser);

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function cancelEdit() {
    setName(user.name || '');
    setPhone(user.phone || '');
    setLocation(user.location || '');
    setLang(user.preferredLanguage || 'English');
    setCrops(user.cropsGrown || '');

    setEditing(false);
  }

  function getLanguageName(
    value: string
  ) {
    if (value === 'Telugu') {
      return t('languageTelugu');
    }

    if (value === 'Hindi') {
      return t('languageHindi');
    }

    return t('languageEnglish');
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">

      <div className="mb-8">

        <p className="text-sm font-medium text-[#2D6A4F] mb-2">
          {t('account')}
        </p>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#1A2E1A]">
          {t('farmerProfile')}
        </h1>

        <p className="text-[#7A8C7A] mt-2">
          {t('manageFarmerProfile')}
        </p>

      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span className="text-lg">✓</span>
          {t('profileSaved')}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-[#D4E6C3] bg-white shadow-sm">

        <div className="bg-gradient-to-r from-[#EAF7E8] via-[#F5FAF1] to-white px-6 md:px-8 py-7">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              <div className="relative">

                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#D4E6C3] bg-white shadow-sm">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={t('profilePhoto')}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🌾
                    </div>
                  )}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2D6A4F] text-white shadow-md transition hover:bg-[#24563F]"
                >
                  📷
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

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

                {profileImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    {t('removePhoto')}
                  </button>
                )}

              </div>

            </div>

            {!editing && (
              <Btn
                onClick={() =>
                  setEditing(true)
                }
              >
                {t('editProfile')}
              </Btn>
            )}

          </div>

        </div>

        {editing ? (

          <div className="p-6 md:p-8">

            <div className="mb-8">

              <h3 className="text-lg font-semibold text-[#1A2E1A]">
                {t('editFarmerInformation')}
              </h3>

              <p className="mt-1 text-sm text-[#7A8C7A]">
                {t('updateFarmerProfileDetails')}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input
                label={t('name')}
                value={name}
                onChange={value =>
                  setName(value)
                }
                placeholder={t('yourName')}
              />

              <Input
                label={t('phone')}
                value={phone}
                onChange={value =>
                  setPhone(value)
                }
                type="tel"
                placeholder="+91 XXXXX XXXXX"
              />

              <Input
                label={t('location')}
                value={location}
                onChange={value =>
                  setLocation(value)
                }
                placeholder={t('yourCity')}
              />

              <Select
                label={t('preferredLanguage')}
                value={lang}
                onChange={value =>
                  setLang(
                    value as
                      | 'English'
                      | 'Telugu'
                      | 'Hindi'
                  )
                }
                options={LANGUAGES}
              />

              <div className="md:col-span-2">

                <label className="text-sm font-medium text-[#3D5A3D]">
                  {t('cropsGrown')}
                </label>

                <input
                  value={crops}
                  onChange={e =>
                    setCrops(e.target.value)
                  }
                  placeholder={t('cropExamples')}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] text-base focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
                />

                <p className="mt-1.5 text-xs text-[#7A8C7A]">
                  {t('separateCrops')}
                </p>

              </div>

            </div>

            <div className="mt-8 flex flex-wrap gap-3">

              <Btn
                variant="outline"
                onClick={cancelEdit}
              >
                {t('cancel')}
              </Btn>

              <Btn onClick={save}>
                {t('saveProfile')}
              </Btn>

            </div>

          </div>

        ) : (

          <div className="p-6 md:p-8">

            <ProfileSection
              title={t('farmerInformation')}
              subtitle={t('farmerInformationDetails')}
            >

              <InfoCard
                icon="👤"
                label={t('name')}
                value={
                  user.name ||
                  t('notSet')
                }
              />

              <InfoCard
                icon="🌾"
                label={t('username')}
                value={`@${user.username}`}
              />

              <InfoCard
                icon="📍"
                label={t('location')}
                value={
                  user.location ||
                  t('notSet')
                }
              />

              <InfoCard
                icon="🌱"
                label={t('cropsGrown')}
                value={
                  user.cropsGrown ||
                  t('notSet')
                }
              />

            </ProfileSection>

            <div className="my-8 border-t border-[#E7EFDF]" />

            <ProfileSection
              title={t('contactInformation')}
              subtitle={t('communicationInformation')}
            >

              <InfoCard
                icon="📞"
                label={t('phone')}
                value={
                  user.phone ||
                  t('notSet')
                }
              />

              <InfoCard
                icon="✉️"
                label={t('email')}
                value={user.email}
              />

            </ProfileSection>

            <div className="my-8 border-t border-[#E7EFDF]" />

            <ProfileSection
              title={t('preferences')}
              subtitle={t('customizeExperience')}
            >

              <InfoCard
                icon="🌐"
                label={t('preferredLanguage')}
                value={getLanguageName(
                  user.preferredLanguage
                )}
              />

            </ProfileSection>

          </div>

        )}

      </section>

      {!editing && (
        <div className="mt-5 flex items-center gap-2 text-sm text-[#7A8C7A]">

          <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" />

          {t('profilePersonalize')}

        </div>
      )}

    </main>
  );
}

function ProfileSection({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>

      <div className="mb-6">

        <h3 className="text-lg font-semibold text-[#1A2E1A]">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#7A8C7A]">
          {subtitle}
        </p>

      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>

    </section>
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
    <div className="rounded-2xl border border-[#E1ECD8] bg-[#FBFDF9] p-5 transition hover:border-[#C8DDBB]">

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