export class Profile {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly age?: number,
    public readonly height?: number,
    public readonly weight?: number,
    public readonly gender?: string,
    public readonly yearsTraining?: number,
    public readonly weightGoal?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
