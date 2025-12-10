import profile from "../assets/profile.png";
export default function GuestDetailsCard({ name, room }) {
  return (
    <div className="flex items-center gap-5 mb-6">
      <img
        src={profile}
        alt="guest avatar"
        className="w-10 h-10 rounded-full bg-white/20 p-[2px]"
      />
      <div>
        <p className="text-sm opacity-80">Guest Name</p>
        <p className="text-lg font-semibold">
          {name} • Room {room}
        </p>
      </div>
    </div>
  );
}