import { PageTitle } from "@/app/components/layout/PageTitle"
import { UnavailableNote } from "@/app/components/feedback/ContentState"
import { Button } from "@/app/components/ui/button"
export function AddressSettingsPage() {
  const addresses = [
    {
      id: "1",
      label: "Nhà riêng",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: "2",
      label: "Văn phòng",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      isDefault: false,
    },
    {
      id: "3",
      label: "Địa chỉ khác",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      isDefault: false,
    },
  ]
  return (
    <section>
      <PageTitle title="Địa chỉ" />
      <UnavailableNote>
        Địa chỉ minh họa. Thêm, chỉnh sửa và đặt mặc định chưa được kết nối tài
        khoản.
      </UnavailableNote>
      <Button disabled className="mb-4">
        Thêm địa chỉ
      </Button>
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li className="border border-border rounded-lg p-4" key={address.id}>
            <h2>{address.label}</h2>
            {address.isDefault && (
              <p className="text-sm mt-2">Mặc định trong dữ liệu mẫu</p>
            )}
            <p className="my-3">{address.address}</p>
            <div className="flex flex-wrap gap-3">
              <Button disabled variant="outline">
                Chỉnh sửa
              </Button>
              {!address.isDefault && (
                <Button disabled variant="outline">
                  Đặt mặc định
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
