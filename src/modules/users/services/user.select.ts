const userSelect = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  phone_number: true,
  profile_photo: true,
  is_active: true,
  is_deleted: true,
  created_at: true,
  updated_at: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
};

export { userSelect };

