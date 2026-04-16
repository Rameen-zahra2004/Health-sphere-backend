import TokenVersion from "../../models/TokenVersion";

/**
 * Increase version = invalidates ALL old tokens
 */
export const revokeUserTokens = async (userId: string) => {
  await TokenVersion.findOneAndUpdate(
    { userId },
    { $inc: { version: 1 } },
    { upsert: true, new: true }
  );
};

/**
 * Get current token version
 */
export const getTokenVersion = async (userId: string): Promise<number> => {
  const record = await TokenVersion.findOne({ userId });

  if (!record) {
    const created = await TokenVersion.create({ userId, version: 0 });
    return created.version;
  }

  return record.version;
};