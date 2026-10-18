"use client";

interface HeaderProps {
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatarUrl?: string;
}

export default function Header({
  title = "Séance Joseph & Hugo - Simulation entretien technique",
  date = "June 12th, 2022 | 11:00 AM",
  userName = "Adam Joseph",
  userRole = "Coach",
  userAvatarUrl,
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header
      className="flex items-center h-[72px] flex-shrink-0 relative px-5"
      style={{
        background:
          "linear-gradient(90deg, rgba(212,17,17,1) 12%, rgba(167,75,75,1) 100%)",
      }}
    >
      {/* Zeeta Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className="text-white text-[26px] tracking-tight"
          style={{ fontFamily: "'ABeeZee', sans-serif", fontStyle: "italic", fontWeight: 400 }}
        >
          zeeta
        </span>
      </div>

      {/* Vertical divider */}
      <div
        className="w-[1.5px] self-stretch my-4 mx-5 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.3)" }}
      />

      {/* Title area */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-white text-[16px] font-[500] leading-tight truncate"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h1>
        {date && (
          <p
            className="text-white/70 text-[12px] font-[400] mt-0.5"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {date}
          </p>
        )}
      </div>

      {/* User profile pill */}
      <div
        className="flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 flex-shrink-0"
        style={{ backgroundColor: "#f6f6f6" }}
      >
        {/* Avatar */}
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-[2.5px] border-white flex-shrink-0 bg-gray-200">
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#25293b] font-[600] text-[14px]">
              {initials}
            </div>
          )}
        </div>

        {/* Name & role */}
        <div className="hidden sm:block">
          <p
            className="text-[14px] font-[500] text-[#25293b] leading-tight"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {userName}
          </p>
          <p
            className="text-[11px] font-[500] text-[#9e9e9e] leading-tight"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {userRole}
          </p>
        </div>
      </div>
    </header>
  );
}
